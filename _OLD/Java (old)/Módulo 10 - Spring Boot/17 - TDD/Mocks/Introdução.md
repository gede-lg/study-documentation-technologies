## O que é e para que serve?

**Mockito** é um framework de testes popular para o Java, utilizado principalmente para criar objetos simulados (mocks). Ele permite testar componentes de software de forma isolada, simulando o comportamento das dependências desses componentes. Isso facilita a criação de testes unitários, onde você deseja testar uma unidade de código (como um método ou uma classe) sem depender de outras partes do sistema.

### Principais Benefícios

- **Isolamento de componentes**: Permite testar uma unidade de código sem depender de suas dependências reais.
- **Simplicidade**: Facilita a criação de objetos simulados e a definição de seu comportamento esperado.
- **Flexibilidade**: Suporta diversas maneiras de simular comportamentos, capturar interações e verificar resultados.

## Quando e como usar?

### Quando usar

- **Testes Unitários**: Quando você precisa testar um método ou uma classe em isolamento, sem depender de suas dependências externas.
- **Simulação de Dependências**: Quando as dependências são difíceis de configurar, lentas ou possuem efeitos colaterais indesejados (como acessar um banco de dados real).
- **Verificação de Interações**: Quando você quer garantir que certos métodos foram chamados ou não durante a execução do teste.

### Como usar

1. **Adicionar Dependência**: Primeiro, adicione a dependência do Mockito ao seu projeto. Em um projeto Maven, isso seria feito no `pom.xml`:

    ```xml
    <dependency>
        <groupId>org.mockito</groupId>
        <artifactId>mockito-core</artifactId>
        <version>3.11.2</version>
        <scope>test</scope>
    </dependency>
    ```

2. **Criação de Mocks**: Utilize a anotação `@Mock` ou o método `Mockito.mock()` para criar objetos simulados.
3. **Definição de Comportamento**: Use o método `when().thenReturn()` para definir o comportamento dos métodos simulados.
4. **Verificação de Comportamento**: Utilize o método `verify()` para verificar se métodos específicos foram chamados com certos parâmetros.

## Estrutura de um Teste com Mockito

Os testes com Mockito geralmente seguem a estrutura **Given-When-Then**:

1. **Given**: Configuração inicial do teste, incluindo a criação de mocks e definição de seu comportamento.
2. **When**: Execução da unidade de código sob teste.
3. **Then**: Verificação dos resultados e interações.

### Given

No bloco Given, você configura os mocks e define o comportamento esperado deles. 

#### Principais Métodos

- **mock()**: Cria um mock de uma classe ou interface.
    ```java
    MyClass myClassMock = mock(MyClass.class);
    ```
- **@Mock**: Anotação para criar mocks de forma automática.
    ```java
    @Mock
    MyClass myClassMock;
    ```
- **@InjectMocks**: Injeta os mocks nas dependências da classe que está sendo testada.
    ```java
    @InjectMocks
    MyService myService;
    ```

### When

No bloco When, você executa a ação que está sendo testada.

#### Principais Métodos

- **when()**: Define o comportamento esperado de um método mockado.
    ```java
    when(myClassMock.someMethod()).thenReturn(someValue);
    ```
- **thenReturn()**: Define o valor de retorno do método mockado.
    ```java
    when(myClassMock.someMethod()).thenReturn(someValue);
    ```
- **thenThrow()**: Define que o método mockado deve lançar uma exceção.
    ```java
    when(myClassMock.someMethod()).thenThrow(new RuntimeException());
    ```

### Then

No bloco Then, você verifica os resultados e interações com os mocks.

#### Principais Métodos

- **verify()**: Verifica se um método foi chamado com certos parâmetros.
    ```java
    verify(myClassMock).someMethod();
    ```
- **verifyNoMoreInteractions()**: Verifica se não houve mais interações com os mocks.
    ```java
    verifyNoMoreInteractions(myClassMock);
    ```
- **verifyZeroInteractions()**: Verifica se não houve nenhuma interação com os mocks.
    ```java
    verifyZeroInteractions(myClassMock);
    ```

## Exemplo Completo

Aqui está um exemplo completo de um teste usando Mockito seguindo a estrutura Given-When-Then.

```java
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class MyServiceTest {

    @InjectMocks
    private MyService myService;

    @Mock
    private Dependency dependency;

    @BeforeEach
    void setUp() {
        // Given: Definindo o comportamento do mock
        when(dependency.someMethod()).thenReturn("mocked value");
    }

    @Test
    void testMyServiceMethod() {
        // When: Executando o método sob teste
        String result = myService.myMethod();

        // Then: Verificando os resultados
        assertEquals("mocked value", result);

        // Then: Verificando interações com o mock
        verify(dependency).someMethod();
    }
}
```

### Explicação do Exemplo

1. **Given**: No método `setUp()`, o comportamento do mock `dependency` é definido para retornar `"mocked value"` quando o método `someMethod()` for chamado.
2. **When**: No método de teste `testMyServiceMethod()`, o método `myMethod()` do `myService` é chamado.
3. **Then**: Verifica-se que o resultado é `"mocked value"` e que `someMethod()` foi chamado no mock `dependency`.
## Conclusão

Mockito é uma ferramenta poderosa e flexível para testes unitários em Java. Ele permite a criação de mocks para simular dependências, facilitando o isolamento da unidade de código sob teste. Seguindo a estrutura Given-When-Then, você pode escrever testes claros e compreensíveis que verificam tanto os resultados esperados quanto as interações com as dependências simuladas.