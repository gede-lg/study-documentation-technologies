## Guia Completo sobre JUnit

JUnit é uma das bibliotecas de teste de unidade mais populares para o ambiente Java. Ele fornece um framework simples e eficiente para escrever e executar testes. Aqui está uma explicação detalhada sobre as principais anotações do JUnit, suas sintaxes de uso, finalidades e exemplos de código.

### Anotações do JUnit

#### 1. @Test

**Finalidade**: Marca um método como um caso de teste.

**Sintaxe**:
```java
@Test
void nomeDoMetodo() {
    // código do teste
}
```

**Exemplo**:
```java
@Test
void deveRetornarSomaCorreta() {
    assertEquals(5, 2 + 3);
}
```

#### 2. @BeforeEach

**Finalidade**: Executa um método antes de cada caso de teste na classe de teste.

**Sintaxe**:
```java
@BeforeEach
void setup() {
    // código de configuração
}
```

**Exemplo**:
```java
@BeforeEach
void setup() {
    lista = new ArrayList<>();
    lista.add("item1");
}
```

#### 3. @AfterEach

**Finalidade**: Executa um método após cada caso de teste na classe de teste.

**Sintaxe**:
```java
@AfterEach
void teardown() {
    // código de limpeza
}
```

**Exemplo**:
```java
@AfterEach
void teardown() {
    lista.clear();
}
```

#### 4. @BeforeAll

**Finalidade**: Executa um método uma única vez antes de todos os testes na classe de teste. O método deve ser estático.

**Sintaxe**:
```java
@BeforeAll
static void setupAll() {
    // código de configuração global
}
```

**Exemplo**:
```java
@BeforeAll
static void setupAll() {
    conexao = DriverManager.getConnection("jdbc:teste");
}
```

#### 5. @AfterAll

**Finalidade**: Executa um método uma única vez após todos os testes na classe de teste. O método deve ser estático.

**Sintaxe**:
```java
@AfterAll
static void teardownAll() {
    // código de limpeza global
}
```

**Exemplo**:
```java
@AfterAll
static void teardownAll() {
    conexao.close();
}
```

#### 6. @DisplayName

**Finalidade**: Define um nome descritivo para um caso de teste ou classe de teste.

**Sintaxe**:
```java
@DisplayName("Descrição do Teste")
void nomeDoMetodo() {
    // código do teste
}
```

**Exemplo**:
```java
@DisplayName("Teste de soma de dois números")
@Test
void deveRetornarSomaCorreta() {
    assertEquals(5, 2 + 3);
}
```

#### 7. @Disabled

**Finalidade**: Desabilita um teste ou uma classe de teste.

**Sintaxe**:
```java
@Disabled("Motivo para desabilitar")
void nomeDoMetodo() {
    // código do teste
}
```

**Exemplo**:
```java
@Disabled("Função ainda não implementada")
@Test
void testeDesabilitado() {
    // código do teste
}
```

#### 8. @Nested

**Finalidade**: Agrupa classes de teste aninhadas para organizar testes de forma hierárquica.

**Sintaxe**:
```java
@Nested
class ClasseDeTesteAninhada {
    // métodos de teste
}
```

**Exemplo**:
```java
@Nested
class QuandoListaEstaVazia {
    @Test
    void deveTerTamanhoZero() {
        assertTrue(lista.isEmpty());
    }
}
```

#### 9. @Tag

**Finalidade**: Marca um teste ou uma classe de teste com um identificador para facilitar a execução de subconjuntos de testes.

**Sintaxe**:
```java
@Tag("categoria")
void nomeDoMetodo() {
    // código do teste
}
```

**Exemplo**:
```java
@Tag("rapido")
@Test
void testeRapido() {
    assertEquals(2, 1 + 1);
}
```

#### 10. @RepeatedTest

**Finalidade**: Executa um teste várias vezes.

**Sintaxe**:
```java
@RepeatedTest(5)
void nomeDoMetodo() {
    // código do teste
}
```

**Exemplo**:
```java
@RepeatedTest(5)
void deveRetornarSomaCorreta() {
    assertEquals(5, 2 + 3);
}
```

#### 11. @ParameterizedTest

**Finalidade**: Executa um teste várias vezes com diferentes parâmetros.

**Sintaxe**:
```java
@ParameterizedTest
@ValueSource(strings = {"A", "B", "C"})
void testeComParametros(String argumento) {
    assertNotNull(argumento);
}
```

**Exemplo**:
```java
@ParameterizedTest
@ValueSource(ints = {1, 2, 3})
void testeComInteiros(int argumento) {
    assertTrue(argumento > 0);
}
```

#### 12. @MethodSource

**Finalidade**: Fornece parâmetros para um teste a partir de um método.

**Sintaxe**:
```java
@ParameterizedTest
@MethodSource("nomeDoMetodo")
void testeComParametros(String argumento) {
    assertNotNull(argumento);
}

static Stream<String> nomeDoMetodo() {
    return Stream.of("A", "B", "C");
}
```

**Exemplo**:
```java
@ParameterizedTest
@MethodSource("fornecerDados")
void testeComStreamDeDados(String argumento) {
    assertNotNull(argumento);
}

static Stream<String> fornecerDados() {
    return Stream.of("X", "Y", "Z");
}
```

#### 13. @CsvSource

**Finalidade**: Fornece parâmetros para um teste a partir de valores CSV.

**Sintaxe**:
```java
@ParameterizedTest
@CsvSource({"1, 2", "3, 4", "5, 6"})
void testeComCsv(int a, int b) {
    assertTrue(a < b);
}
```

**Exemplo**:
```java
@ParameterizedTest
@CsvSource({"apple, 1", "banana, 2", "cherry, 3"})
void testeComCsv(String fruta, int quantidade) {
    assertNotNull(fruta);
    assertTrue(quantidade > 0);
}
```

#### 14. @CsvFileSource

**Finalidade**: Fornece parâmetros para um teste a partir de um arquivo CSV.

**Sintaxe**:
```java
@ParameterizedTest
@CsvFileSource(resources = "/dados.csv", numLinesToSkip = 1)
void testeComArquivoCsv(String fruta, int quantidade) {
    assertNotNull(fruta);
    assertTrue(quantidade > 0);
}
```

**Exemplo**:
```java
@ParameterizedTest
@CsvFileSource(resources = "/dados.csv", numLinesToSkip = 1)
void testeComArquivoCsv(String fruta, int quantidade) {
    assertNotNull(fruta);
    assertTrue(quantidade > 0);
}
```

### Conclusão

JUnit é uma ferramenta poderosa e flexível para escrever e executar testes de unidade em Java. Com suas diversas anotações e assertivas, ele permite criar testes detalhados e organizados, garantindo a qualidade do código. Conhecer e utilizar essas funcionalidades é essencial para qualquer desenvolvedor que deseja manter um alto padrão de qualidade em seus projetos.