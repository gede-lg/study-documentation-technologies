### O que é e para que serve?

Em JUnit, `@BeforeEach` e `@AfterEach` são anotações usadas para definir métodos que devem ser executados antes e depois de cada método de teste, respectivamente. Da mesma forma, `@BeforeAll` e `@AfterAll` são usados para definir métodos que são executados uma única vez antes e depois de todos os testes em uma classe de teste.

Essas anotações são usadas para configurar e limpar recursos que são necessários para os testes, garantindo que cada teste seja executado em um ambiente limpo e que todos os recursos alocados sejam liberados após a execução dos testes.

### Quando e como usar cada um deles?

#### @BeforeEach

- **Quando usar**: Use `@BeforeEach` quando precisar configurar o estado necessário para cada método de teste. Isso pode incluir a inicialização de objetos, configuração de mocks, ou qualquer preparação que precisa ser feita antes de cada teste.
- **Como usar**: Adicione a anotação `@BeforeEach` antes de um método que deve ser executado antes de cada método de teste.

```java
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class MyServiceTest {

    private MyService myService;

    @BeforeEach
    void setUp() {
        myService = new MyService();
        // Configurações adicionais, se necessário
    }

    @Test
    void testMethod1() {
        assertNotNull(myService);
        // Outras asserções e lógica de teste
    }

    @Test
    void testMethod2() {
        assertNotNull(myService);
        // Outras asserções e lógica de teste
    }
}
```

#### @AfterEach

- **Quando usar**: Use `@AfterEach` quando precisar liberar recursos ou realizar alguma limpeza após cada método de teste. Isso pode incluir fechar conexões de banco de dados, limpar dados de teste, ou redefinir estados compartilhados.
- **Como usar**: Adicione a anotação `@AfterEach` antes de um método que deve ser executado após cada método de teste.

```java
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class MyServiceTest {

    private MyService myService;

    @BeforeEach
    void setUp() {
        myService = new MyService();
        // Configurações adicionais, se necessário
    }

    @AfterEach
    void tearDown() {
        // Limpeza necessária após cada teste
        myService = null;
    }

    @Test
    void testMethod1() {
        assertNotNull(myService);
        // Outras asserções e lógica de teste
    }

    @Test
    void testMethod2() {
        assertNotNull(myService);
        // Outras asserções e lógica de teste
    }
}
```

#### @BeforeAll

- **Quando usar**: Use `@BeforeAll` quando precisar executar alguma configuração apenas uma vez antes de todos os testes na classe. Isso é útil para operações caras ou demoradas, como inicializar uma conexão com o banco de dados que pode ser compartilhada entre todos os testes.
- **Como usar**: Adicione a anotação `@BeforeAll` antes de um método estático que deve ser executado antes de todos os métodos de teste.

```java
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class MyServiceTest {

    private static DatabaseConnection dbConnection;

    @BeforeAll
    static void setUpBeforeClass() {
        dbConnection = new DatabaseConnection();
        dbConnection.connect();
        // Configurações adicionais, se necessário
    }

    @Test
    void testMethod1() {
        assertTrue(dbConnection.isConnected());
        // Outras asserções e lógica de teste
    }

    @Test
    void testMethod2() {
        assertTrue(dbConnection.isConnected());
        // Outras asserções e lógica de teste
    }
}
```

#### @AfterAll

- **Quando usar**: Use `@AfterAll` quando precisar liberar recursos ou realizar alguma limpeza uma vez após todos os testes na classe terem sido executados. Isso é útil para liberar recursos compartilhados, como fechar a conexão com o banco de dados.
- **Como usar**: Adicione a anotação `@AfterAll` antes de um método estático que deve ser executado após todos os métodos de teste.

```java
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class MyServiceTest {

    private static DatabaseConnection dbConnection;

    @BeforeAll
    static void setUpBeforeClass() {
        dbConnection = new DatabaseConnection();
        dbConnection.connect();
        // Configurações adicionais, se necessário
    }

    @AfterAll
    static void tearDownAfterClass() {
        // Limpeza necessária após todos os testes
        dbConnection.disconnect();
    }

    @Test
    void testMethod1() {
        assertTrue(dbConnection.isConnected());
        // Outras asserções e lógica de teste
    }

    @Test
    void testMethod2() {
        assertTrue(dbConnection.isConnected());
        // Outras asserções e lógica de teste
    }
}
```

### Informações adicionais

- **Execução em Classe de Teste**: `@BeforeEach` e `@AfterEach` são executados uma vez para cada método de teste na classe, garantindo um ambiente limpo para cada teste. `@BeforeAll` e `@AfterAll` são executados uma vez por classe de teste, geralmente usados para configuração e limpeza global.
- **Métodos Estáticos**: Métodos anotados com `@BeforeAll` e `@AfterAll` devem ser estáticos. Isso é necessário porque essas anotações são executadas uma vez por classe, e métodos estáticos podem ser chamados sem instanciar a classe de teste.
- **Ordem de Execução**: A ordem de execução para uma classe de teste é:
  1. `@BeforeAll`
  2. `@BeforeEach`
  3. Método de teste
  4. `@AfterEach`
  5. `@AfterAll`

### Conclusão

As anotações `@BeforeEach`, `@AfterEach`, `@BeforeAll` e `@AfterAll` são ferramentas poderosas em JUnit para configurar e limpar o ambiente de teste. Usando essas anotações de forma adequada, você pode garantir que seus testes sejam executados em um ambiente previsível e isolado, o que aumenta a confiabilidade e a manutenção dos seus testes.

Esses métodos permitem a reutilização de código de configuração e limpeza, tornando seus testes mais claros e concisos. Ao entender e aplicar essas anotações corretamente, você estará melhor preparado para escrever testes de unidade eficazes e robustos.