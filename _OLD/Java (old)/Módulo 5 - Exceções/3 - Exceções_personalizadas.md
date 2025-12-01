
Em muitos casos, você pode precisar criar exceções personalizadas para representar erros específicos em sua aplicação. Para fazer isso, você deve criar uma classe que estende a classe `Exception` ou `RuntimeException`.

### 1.1. Exceções Personalizadas Verificadas

Aqui está um exemplo de como criar uma exceção personalizada verificada (que herda de `Exception`):

```java
public class MinhaExcecaoVerificada extends Exception {
    public MinhaExcecaoVerificada(String mensagem) {
        super(mensagem);
    }
}
```

Você pode lançar essa exceção em seu código da seguinte maneira:

```java
public class ExcecaoPersonalizada {
    public static void main(String[] args) {
        try {
            throw new MinhaExcecaoVerificada("Isso é uma exceção personalizada verificada.");
        } catch (MinhaExcecaoVerificada e) {
            System.out.println(e.getMessage());
        }
    }
}
```

### 1.2. Exceções Personalizadas Não Verificadas (RuntimeExceptions)

Para criar exceções personalizadas não verificadas, você pode herdar de `RuntimeException`:

```java
public class MinhaExcecaoNaoVerificada extends RuntimeException {
    public MinhaExcecaoNaoVerificada(String mensagem) {
        super(mensagem);
    }
}
```

E então, você pode lançá-la sem a necessidade de tratá-la explicitamente:

```java
public class ExcecaoPersonalizada {
    public static void main(String[] args) {
        throw new MinhaExcecaoNaoVerificada("Isso é uma exceção personalizada não verificada.");
    }
}
```

## 1.3. Conclusão

O tratamento de exceções é uma parte fundamental da programação em Java, permitindo que você lide com situações de erro de maneira controlada. Criar exceções personalizadas é útil quando você precisa representar erros específicos em sua aplicação. Certifique-se de entender como criar e lançar exceções personalizadas, escolhendo entre exceções verificadas e não verificadas, conforme a necessidade do seu projeto.