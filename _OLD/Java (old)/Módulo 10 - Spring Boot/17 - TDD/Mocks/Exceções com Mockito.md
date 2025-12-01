# Mocks em Testes Java com Mockito

Mockito é uma biblioteca de teste de código aberto para Java, que permite criar mocks (simulações) de objetos em testes unitários. Mocks são objetos simulados que imitam o comportamento de objetos reais, permitindo isolar o código que está sendo testado e verificar interações entre componentes de forma controlada.

## Simulando Exceções com `when/thenThrows`

Às vezes, é necessário simular o lançamento de exceções por métodos mockados para testar o comportamento do código em diferentes cenários. O Mockito oferece a capacidade de simular exceções utilizando os métodos `when` e `thenThrows`.

### Exemplo:

Suponha que temos um serviço `UserService` com um método `getUserById` que lança uma exceção `UserNotFoundException` se o usuário não for encontrado.

```java
public class UserService {
    public User getUserById(int userId) throws UserNotFoundException {
        // Implementação para buscar usuário por ID
        throw new UserNotFoundException("Usuário não encontrado");
    }
}
```

Para testar esse método em uma classe de teste utilizando Mockito, podemos simular a exceção `UserNotFoundException` usando `when` e `thenThrows`.

```java
import static org.mockito.Mockito.*;

public class UserServiceTest {

    @Test(expected = UserNotFoundException.class)
    public void testGetUserById_ThrowsException() throws UserNotFoundException {
        // Configurando o mock para lançar a exceção quando chamado com um determinado ID
        UserService userServiceMock = mock(UserService.class);
        when(userServiceMock.getUserById(1)).thenThrow(new UserNotFoundException("Usuário não encontrado"));

        // Chamando o método sob teste
        userServiceMock.getUserById(1);
    }
}
```

Neste exemplo, quando o método `getUserById(1)` é chamado no mock `userServiceMock`, ele lança uma exceção `UserNotFoundException`, como configurado no `when/thenThrows`.

## Verificando se um Método não foi Chamado

Em testes unitários, às vezes é importante verificar se determinados métodos não foram chamados durante a execução do código. Isso pode ser útil para garantir que certas partes do código não estão sendo executadas quando não deveriam.

O Mockito fornece métodos para verificar se um método específico de um mock não foi chamado, como `verifyZeroInteractions`.

### Exemplo:

Suponha que temos uma classe `EmailService` que envia e-mails, e queremos garantir que um determinado método `sendEmail` não é chamado durante a execução de um teste.

```java
public class EmailService {
    public void sendEmail(String recipient, String message) {
        // Implementação para enviar e-mail
    }
}
```

No teste unitário, podemos verificar se o método `sendEmail` não foi chamado usando o Mockito.

```java
import static org.mockito.Mockito.*;

public class EmailServiceTest {

    @Test
    public void testSendEmail_NotCalled() {
        // Criando um mock para o serviço de e-mail
        EmailService emailServiceMock = mock(EmailService.class);

        // Chamando o método que não deve acionar o envio de e-mail
        // Exemplo: Método de teste que não chama sendEmail

        // Verificando se o método sendEmail não foi chamado
        verifyZeroInteractions(emailServiceMock);
    }
}
```

Neste exemplo, `verifyZeroInteractions(emailServiceMock)` garante que o método `sendEmail` não foi chamado durante a execução do teste.

## Considerações Finais

- Mockito é uma ferramenta poderosa para testes de unidade em Java, facilitando a criação de mocks e simulação de comportamentos.
- Ao simular exceções com `when/thenThrows`, é importante configurar corretamente o comportamento do mock para corresponder aos cenários de teste desejados.
- Verificar se um método não foi chamado é útil para garantir que certas funcionalidades não foram acionadas durante a execução do teste, ajudando a manter a integridade e precisão dos testes.

Com essas técnicas, é possível escrever testes robustos e confiáveis para garantir a qualidade do código Java.