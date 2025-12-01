### Guia Completo sobre Mockito

Mockito é uma das bibliotecas de mocking mais populares para testes unitários em Java. Ele permite que você crie objetos simulados (mocks) para testar o comportamento de classes e métodos isoladamente, sem depender de suas implementações reais. Vamos detalhar as anotações do Mockito, juntamente com exemplos de código e explicações compreensíveis.

#### Principais Anotações do Mockito

1. **@Mock**
2. **@InjectMocks**
3. **@Spy**
4. **@Captor**
5. **@RunWith(MockitoJUnitRunner.class)**
6. **@ExtendWith(MockitoExtension.class)**

### 1. @Mock

A anotação `@Mock` é usada para criar mocks das dependências que uma classe em teste possui. 

**Sintaxe de uso e finalidade:**

```java
@Mock
private MinhaDependencia minhaDependencia;
```

**Exemplo de código:**

```java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MinhaClasseTest {

    @Mock
    private MinhaDependencia minhaDependencia;

    @InjectMocks
    private MinhaClasse minhaClasse;

    @Test
    void testeComMock() {
        when(minhaDependencia.metodo()).thenReturn("Mockado");
        
        String resultado = minhaClasse.metodoQueUsaDependencia();
        
        assertEquals("Mockado", resultado);
    }
}
```

### 2. @InjectMocks

A anotação `@InjectMocks` é usada para criar uma instância da classe em teste e injetar automaticamente os mocks criados com a anotação `@Mock` ou `@Spy` nas dependências dessa classe.

**Sintaxe de uso e finalidade:**

```java
@InjectMocks
private MinhaClasse minhaClasse;
```

**Exemplo de código:**

```java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class MinhaClasseTest {

    @Mock
    private MinhaDependencia minhaDependencia;

    @InjectMocks
    private MinhaClasse minhaClasse;

    @Test
    void testeComInjecaoDeMocks() {
        when(minhaDependencia.metodo()).thenReturn("Mockado");
        
        String resultado = minhaClasse.metodoQueUsaDependencia();
        
        assertEquals("Mockado", resultado);
    }
}
```

### 3. @Spy

A anotação `@Spy` cria uma instância real da classe e permite espiar (spy) a interação com essa instância. Diferente do mock, que substitui o comportamento, o spy permite a execução dos métodos reais, a menos que sejam stubbed.

**Sintaxe de uso e finalidade:**

```java
@Spy
private MinhaClasse minhaClasse;
```

**Exemplo de código:**

```java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MinhaClasseTest {

    @Spy
    private MinhaClasse minhaClasse;

    @Test
    void testeComSpy() {
        doReturn("Spyado").when(minhaClasse).metodo();
        
        String resultado = minhaClasse.metodo();
        
        assertEquals("Spyado", resultado);
        verify(minhaClasse, times(1)).metodo();
    }
}
```

### 4. @Captor

A anotação `@Captor` é usada para capturar argumentos passados para métodos mockados. 

**Sintaxe de uso e finalidade:**

```java
@Captor
ArgumentCaptor<Tipo> captor;
```

**Exemplo de código:**

```java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.ArgumentCaptor;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MinhaClasseTest {

    @Mock
    private MinhaDependencia minhaDependencia;

    @InjectMocks
    private MinhaClasse minhaClasse;

    @Captor
    private ArgumentCaptor<String> captor;

    @Test
    void testeComCaptor() {
        minhaClasse.metodoQueChamaDependencia("teste");

        verify(minhaDependencia).metodoComParametro(captor.capture());
        assertEquals("teste", captor.getValue());
    }
}
```

### 5. @RunWith(MockitoJUnitRunner.class)

A anotação `@RunWith(MockitoJUnitRunner.class)` é usada em JUnit 4 para habilitar as anotações do Mockito em uma classe de teste. 

**Sintaxe de uso e finalidade:**

```java
@RunWith(MockitoJUnitRunner.class)
public class MinhaClasseTest {
    // Código de teste
}
```

**Exemplo de código:**

```java
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import static org.mockito.Mockito.*;
import static org.junit.Assert.*;

@RunWith(MockitoJUnitRunner.class)
public class MinhaClasseTest {

    @Mock
    private MinhaDependencia minhaDependencia;

    @InjectMocks
    private MinhaClasse minhaClasse;

    @Test
    public void testeComMockitoJUnitRunner() {
        when(minhaDependencia.metodo()).thenReturn("Mockado");
        
        String resultado = minhaClasse.metodoQueUsaDependencia();
        
        assertEquals("Mockado", resultado);
    }
}
```

### 6. @ExtendWith(MockitoExtension.class)

A anotação `@ExtendWith(MockitoExtension.class)` é usada em JUnit 5 para habilitar as anotações do Mockito em uma classe de teste.

**Sintaxe de uso e finalidade:**

```java
@ExtendWith(MockitoExtension.class)
public class MinhaClasseTest {
    // Código de teste
}
```

**Exemplo de código:**

```java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class MinhaClasseTest {

    @Mock
    private MinhaDependencia minhaDependencia;

    @InjectMocks
    private MinhaClasse minhaClasse;

    @Test
    void testeComMockitoExtension() {
        when(minhaDependencia.metodo()).thenReturn("Mockado");
        
        String resultado = minhaClasse.metodoQueUsaDependencia();
        
        assertEquals("Mockado", resultado);
    }
}
```

### Outros Tópicos Importantes sobre Mockito

#### Stubbing

Stubbing é o processo de definir um comportamento para um método mockado.

**Exemplo:**

```java
when(mockObject.metodo()).thenReturn(valor);
```

#### Verificação de Interações

Verificação de que certos métodos foram chamados em um mock.

**Exemplo:**

```java
verify(mockObject).metodo();
verify(mockObject, times(2)).metodo();
```

#### Argument Matchers

Matchers são usados para definir condições mais flexíveis para os argumentos de métodos mockados.

**Exemplo:**

```java
when(mockObject.metodo(anyString())).thenReturn(valor);
```

#### Exceções em Stubbing

Definindo exceções a serem lançadas por métodos mockados.

**Exemplo:**

```java
when(mockObject.metodo()).thenThrow(new RuntimeException("Erro"));
```

### Conclusão

Mockito é uma ferramenta poderosa para testes unitários, permitindo que desenvolvedores isolem o comportamento de classes e métodos, facilitando a verificação de interações e a definição de comportamentos personalizados para dependências mockadas. O uso adequado das anotações e técnicas descritas acima pode aumentar significativamente a eficácia e a legibilidade dos testes.

#### Recursos Adicionais

Para mais informações e detalhes sobre o Mockito, você pode consultar a [documentação oficial do Mockito](https://site.mockito.org/).