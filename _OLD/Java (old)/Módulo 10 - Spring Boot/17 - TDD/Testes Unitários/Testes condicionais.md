# Assumptions e Testes Condicionais

## O que são e para que servem?

**Assumptions** em testes são declarações que verificam certas condições antes de executar um teste. Se a condição especificada pela `Assumption` não for atendida, o teste será ignorado em vez de falhar. Isso é útil em situações onde o teste só deve ser executado sob certas condições prévias, como configuração do sistema, variáveis de ambiente, ou outras dependências externas.

### Por que usar Assumptions?

- **Flexibilidade**: Permitem que testes sejam executados somente quando certas condições são atendidas, evitando falsos negativos.
- **Ambiente Específico**: Útil para testes que dependem de configurações específicas do ambiente, como sistema operacional, versão do JDK, ou variáveis de ambiente.
- **Manutenção**: Facilita a manutenção de testes em projetos que precisam ser executados em múltiplos ambientes com diferentes requisitos.

## Principais Métodos e Como Usar

### `Assume.assumeTrue`

Este método avalia uma condição booleana e ignora o teste se a condição for falsa.

```java
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assumptions.assumeTrue;

public class AssumptionTest {

    @Test
    void testOnlyOnCiServer() {
        assumeTrue("CI".equals(System.getenv("ENV")),
                () -> "Test ignored: not on CI server");
        // Código do teste que só deve rodar no servidor de integração contínua
    }
}
```

### `Assume.assumeFalse`

Este método é o oposto de `assumeTrue`. Ele ignora o teste se a condição for verdadeira.

```java
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assumptions.assumeFalse;

public class AssumptionTest {

    @Test
    void testNotOnDeveloperMachine() {
        assumeFalse("dev".equals(System.getenv("ENV")),
                () -> "Test ignored: running on developer machine");
        // Código do teste que não deve rodar na máquina do desenvolvedor
    }
}
```

### `Assume.assumingThat`

Este método permite que uma parte específica do teste seja executada condicionalmente. Se a condição for falsa, o restante do teste ainda será executado.

```java
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assumptions.assumingThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class AssumptionTest {

    @Test
    void testInAllEnvironments() {
        String env = System.getenv("ENV");

        assumingThat("CI".equals(env),
                () -> {
                    // Código que só deve rodar no servidor de CI
                    assertEquals(2, 1 + 1);
                });

        // Código que deve rodar em qualquer ambiente
        assertEquals(42, 6 * 7);
    }
}
```

### Uso de Assumptions com Métodos Personalizados

Você pode criar métodos personalizados para encapsular a lógica de `Assumptions`, facilitando a reutilização e a leitura do código.

```java
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assumptions.assumeTrue;

public class AssumptionTest {

    @Test
    void testOnlyOnWindows() {
        assumeTrue(isWindows(), "Test ignored: not running on Windows");
        // Código do teste que só deve rodar no Windows
    }

    private boolean isWindows() {
        return System.getProperty("os.name").startsWith("Windows");
    }
}
```

## Vantagens e Boas Práticas

### Vantagens

- **Evita Falsos Negativos**: Testes não falham se as condições do ambiente não são atendidas.
- **Documentação Implícita**: Facilita a compreensão das dependências e pré-condições dos testes.
- **Execução Condicional**: Permite que partes do teste sejam executadas condicionalmente, dependendo do ambiente.

### Boas Práticas

- **Documentação**: Use mensagens claras nas `Assumptions` para explicar por que um teste foi ignorado.
- **Modularidade**: Encapsule lógica de assunções em métodos reutilizáveis.
- **Consistência**: Aplique `Assumptions` consistentemente para todos os testes que dependem de condições específicas.

## Considerações Finais

**Assumptions** são uma ferramenta poderosa para a criação de testes condicionais em ambientes complexos. Elas ajudam a garantir que os testes sejam executados apenas quando as condições necessárias forem atendidas, melhorando a confiabilidade e a manutenção dos testes. 

Aqui está um resumo das principais funções e suas utilidades:

- **assumeTrue**: Ignora o teste se a condição for falsa.
- **assumeFalse**: Ignora o teste se a condição for verdadeira.
- **assumingThat**: Executa condicionalmente uma parte do teste, mas permite que o restante do teste seja executado de qualquer maneira.

Usando `Assumptions`, você pode criar testes mais robustos e confiáveis que se adaptam a diferentes ambientes e configurações, garantindo que eles só sejam executados quando realmente fizerem sentido.