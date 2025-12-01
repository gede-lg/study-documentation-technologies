# Nomes de Propriedades com @JsonProperty

## Introdução

O Jackson é a biblioteca mais utilizada em Java para serialização e desserialização de objetos Java para/desde JSON. Quando trabalhamos em aplicações Spring Boot, muitas vezes precisamos controlar exatamente como os nomes das propriedades aparecem no JSON – tanto na entrada (request) quanto na saída (response). A anotação `@JsonProperty` permite mapear nomes de campos Java para nomes diferentes no JSON, garantindo compatibilidade com contratos de API, convenções de nomenclatura ou requisitos de clientes externos.

Este documento oferece:

1. **Visão Geral Concisa** do propósito e funcionamento básico de `@JsonProperty`.
2. **Explicação Detalhada e Completa**, incluindo exemplos de código, melhores práticas, cenários de restrição e um projeto prático simplificado.

## Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conceitos-fundamentais)
2. [Visão Geral Concisa](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#vis%C3%A3o-geral-concisa)
3. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    1. Definição básica de `@JsonProperty`
    2. Exemplos comentados
    3. Variações e configurações adicionais
4. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
5. [Componentes Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
    - `ObjectMapper`
    - Outras anotações (por ex. `@JsonIgnore`, `@JsonInclude`)
    - Classes de configuração e módulos adicionais
6. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
7. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
    - Estrutura do projeto
    - Definição de DTOs com `@JsonProperty`
    - Controller REST
    - Teste de serialização/desserialização
8. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## Conceitos Fundamentais

Antes de mergulharmos na anotação `@JsonProperty`, é importante compreender alguns conceitos-chave:

- **Jackson**: biblioteca de processamento de dados JSON para Java, composta por módulos como `jackson-core`, `jackson-annotations` e `jackson-databind`.
- **Serialização**: conversão de objetos Java em JSON.
- **Desserialização**: conversão de documentos JSON em objetos Java.
- **Contrato JSON**: especificação de como a API expõe ou consome dados JSON. Muitas vezes envolve convenções de nomenclatura (por exemplo, `camelCase` em Java vs. `snake_case` no JSON).
- **Mapeamento de Propriedades**: correspondência entre nomes de campos Java e chaves JSON. Por padrão, Jackson utiliza o nome do campo ou o nome do método getter/setter para gerar a chave JSON. Porém, quando precisamos que o JSON tenha um nome diferente, usamos `@JsonProperty`.

**Importância**:

- As APIs podem exigir nomes de campo específicos para atender clientes de diferentes linguagens.
- Ao renomear uma propriedade Java (por refatoração), é possível manter compatibilidade com versões anteriores da API, deixando o JSON inalterado.
- Documentações como OpenAPI/Swagger podem se basear nos nomes definidos por `@JsonProperty` para gerar contratos precisos.

---

## Visão Geral Concisa

Sem entrar em detalhes de sintaxe, eis o funcionamento básico de `@JsonProperty`:

- **Propósito**: indicar explicitamente qual nome será usado para aquela propriedade no JSON.
- **Uso Típico**: sobre o campo ou método *getter/setter*.
- **Resultado**:
    - Na **serialização**, o nome definido em `@JsonProperty("nomeJson")` será usado como chave no JSON resultante.
    - Na **desserialização**, o Jackson procurará a chave `"nomeJson"` dentro do JSON de entrada para mapear ao campo Java correspondente.
- **Vantagens**: mapeamento direto, controle sobre convenções de nomenclatura e facilidade para documentação automática.

---

## Sintaxe Detalhada e Uso Prático

### 1. Definição Básica de `@JsonProperty`

A anotação `@JsonProperty` pertence ao pacote **`com.fasterxml.jackson.annotation`**. Seu uso mais comum é:

```java
import com.fasterxml.jackson.annotation.JsonProperty;

public class Pessoa {
    @JsonProperty("full_name")
    private String nomeCompleto;

    // Construtor, getters e setters...
}

```

Nesse exemplo:

- O campo Java `nomeCompleto` será exposto no JSON como `"full_name"`.
- Durante a conversão de JSON para Java, o Jackson mapeará o valor de `"full_name"` para o campo `nomeCompleto`.

### 2. Exemplos Completos Comentados

### 2.1. Mapeando um Campo Privado

```java
import com.fasterxml.jackson.annotation.JsonProperty;

public class Produto {

    // O JSON usará a chave "product_id" em vez de "codigo"
    @JsonProperty("product_id")
    private Long codigo;

    // O JSON usará a chave "nome_produto" em vez de "nome"
    @JsonProperty("nome_produto")
    private String nome;

    // Construtor padrão necessário para desserialização
    public Produto() {}

    // Construtor para facilitar instância
    public Produto(Long codigo, String nome) {
        this.codigo = codigo;
        this.nome = nome;
    }

    // Getters e setters (Jackson pode usar campos diretamente ou getters/setters)
    public Long getCodigo() {
        return codigo;
    }

    public void setCodigo(Long codigo) {
        this.codigo = codigo;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}

```

- **Serialização**:
    
    ```java
    Produto p = new Produto(123L, "Cadeira");
    ObjectMapper mapper = new ObjectMapper();
    String json = mapper.writeValueAsString(p);
    // Resultado JSON: {"product_id":123,"nome_produto":"Cadeira"}
    
    ```
    
- **Desserialização**:
    
    ```java
    String json = "{\"product_id\":456,\"nome_produto\":\"Mesa\"}";
    Produto p2 = mapper.readValue(json, Produto.class);
    // p2.getCodigo() == 456
    // p2.getNome()   == "Mesa"
    
    ```
    

### 2.2. Utilizando em Getters e Setters

É possível anotar *apenas* o getter ou o setter, quando não se deseja anotar o campo diretamente:

```java
public class Usuario {

    private String login;
    private String email;

    @JsonProperty("user_login")
    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    @JsonProperty("user_email")
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}

```

- O Jackson, por padrão, verifica anotações em **getters/setters** na serialização.
- Na desserialização, ele pode usar setters anotados para mapear a entrada.

### 2.3. Propriedades Somente para Escrita ou Somente para Leitura

- **Somente Serialização** (`access = JsonProperty.Access.READ_ONLY`): define que a propriedade será incluída no JSON de saída, mas ignorada no JSON de entrada.
- **Somente Desserialização** (`access = JsonProperty.Access.WRITE_ONLY`): a propriedade é consumida no JSON de entrada, mas omitida na resposta.

```java
public class ContaBancaria {

    @JsonProperty(value = "account_number", access = JsonProperty.Access.READ_ONLY)
    private String numeroConta;

    @JsonProperty(value = "senha", access = JsonProperty.Access.WRITE_ONLY)
    private String senha;

    // getters e setters
}

```

- Ao serializar, `numeroConta` aparecerá, mas `senha` será omitida.
- Ao desserializar, `senha` será considerado, mas `numeroConta` não será extraído do JSON de entrada.

### 3. Variações e Configurações Adicionais

### 3.1. Valores Padrão com `defaultValue`

Apesar de menos comum, é possível definir um valor padrão quando a chave não está presente no JSON:

```java
public class Configuracao {

    @JsonProperty(value = "timeout", defaultValue = "30")
    private Integer tempoTimeout;

    // getters e setters
}

```

- Se `"timeout"` não estiver presente, `tempoTimeout` virá com valor `30`.
- Essa característica requer que a desserialização seja configurada com `mapper.configure(DeserializationFeature.FAIL_ON_MISSING_CREATOR_PROPERTIES, false);`.

### 3.2. Suportando Vários Nomes (Aliases) com `@JsonAlias`

Embora não seja `@JsonProperty`, frequentemente é usado em conjunto. Permite mapear múltiplas chaves JSON para a mesma propriedade:

```java
public class Cliente {

    @JsonProperty("name")
    @JsonAlias({"nome", "full_name"})
    private String nome;

    // getters e setters
}

```

- Se o JSON contiver `"name"`, `"nome"` ou `"full_name"`, todos mapearão para o campo `nome`.

---

## Cenários de Restrição ou Não Aplicação

Apesar da versatilidade de `@JsonProperty`, existem situações em que seu uso pode não ser adequado ou necessário:

1. **Naming Strategy Global**
    - Em vez de anotar cada campo, pode-se configurar uma estratégia global (por exemplo, `PropertyNamingStrategy.SNAKE_CASE`) no `ObjectMapper`. Nesse caso, Jackson automaticamente converte `nomeCompleto` → `nome_completo` sem precisar de anotações individuais.
    - **Quando não usar `@JsonProperty`**: se todos os campos seguirem a mesma convenção de nomenclatura.
2. **Performance e Overhead**
    - Anotar centenas de campos em classes complexas pode gerar mais trabalho de manutenção.
    - Se a apenas uma ou duas propriedades precisam de tratamento especial, usa-se annotation. Para muitos campos, melhor naming strategy global.
3. **Campos Transientes ou não Serializáveis**
    - Se não for desejado expor determinado campo no JSON, é preferível usar `@JsonIgnore` ou `transient` ao invés de `@JsonProperty`.
4. **Classes com Jackson não presente no Classpath**
    - Em projetos que não incluem Jackson (por opção de outra biblioteca JSON), a anotação não surtirá efeito. Nesse caso, usar APIs da biblioteca escolhida (por ex. Gson, Moshi).
5. **Objetos de Terceiros sem Fonte Disponível**
    - Não é possível anotar classes de terceiros. Neste caso, utiliza-se *Mixin Annotations* ou configurações no `ObjectMapper` para mapear nomes.

---

## Componentes Chave Associados

### 1. `ObjectMapper`

- **Descrição**: classe principal do Jackson para configurar e executar serialização/desserialização.
- **Principais Métodos**:
    - `writeValueAsString(Object obj)`: serializa em JSON.
    - `readValue(String json, Class<T> clazz)`: desserializa JSON.
    - `setPropertyNamingStrategy(PropertyNamingStrategy strategy)`: configura convenção global.
    - `configure(DeserializationFeature, boolean)`: configura comportamento de desserialização (por ex. falhar se propriedade ausente).
- **Uso Comum**:
    
    ```java
    ObjectMapper mapper = new ObjectMapper();
    mapper.setPropertyNamingStrategy(PropertyNamingStrategy.SNAKE_CASE);
    
    ```
    
    Com isso, mesmo sem `@JsonProperty`, todos os campos camelCase viraram snake_case.
    

### 2. Outras Anotações Relacionadas

- **`@JsonIgnore`**: ignora o campo tanto na serialização quanto na desserialização.
- **`@JsonInclude`**: controla inclusão de valores (por ex., `Include.NON_NULL` para omitir nulls).
- **`@JsonAlias`**: permite nomes alternativos na desserialização.
- **`@JsonCreator` & `@JsonProperty` juntos**: para desserialização via construtor.
    
    ```java
    public class Endereco {
        private String rua;
        private String cidade;
    
        @JsonCreator
        public Endereco(
            @JsonProperty("street") String rua,
            @JsonProperty("city") String cidade) {
            this.rua = rua;
            this.cidade = cidade;
        }
        // getters e setters
    }
    
    ```
    
    - Aqui, o Jackson chama esse construtor ao desserializar JSON com chaves `"street"` e `"city"`.

### 3. Módulos Adicionais

- **`jackson-datatype-jsr310`**: para suporte a classes do pacote `java.time`, como `LocalDate`, `LocalDateTime`.
- **`jackson-module-kotlin`** (em projetos Kotlin): facilita mapeamento de data classes.
- **`SimpleModule` e Custom Serializers/Deserializers**: quando precisamos controlar totalmente como um tipo complexo vira JSON. A anotação `@JsonProperty` pode coexistir com serializers customizados.

---

## Melhores Práticas e Padrões de Uso

1. **Defina Naming Strategy Global Quando Possível**
    - Se toda a API segue a convenção `snake_case`, configure `mapper.setPropertyNamingStrategy(SNAKE_CASE)` em vez de anotar cada campo.
    - Exemplo em Spring Boot:
        
        ```java
        @Bean
        public Jackson2ObjectMapperBuilderCustomizer customizer() {
            return builder -> builder.propertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
        }
        
        ```
        
2. **Use `@JsonProperty` Apenas em Casos Específicos**
    - Para nomes incompatíveis com a estratégia global ou quando precisar de apelidos múltiplos.
    - Evita anotações redundantes em campos que já seguem convenção padrão.
3. **Favor Getters/Setters ao Invés de Campos Raw**
    - Anotar getters melhora o encapsulamento e mantém o campo privado.
    - Exemplo:
        
        ```java
        @JsonProperty("data_nascimento")
        public LocalDate getDataNascimento() { ... }
        
        ```
        
4. **Documente Seu Contrato**
    - Ao usar `@JsonProperty`, lembre-se de atualizar documentação (Swagger/OpenAPI) para refletir nomes JSON.
    - Em Spring Boot, basta usar o mesmo DTO anotado para gerar documentação pelo Springdoc ou Swagger.
5. **Evite Conflito de Nomes**
    - Não use duas propriedades diferentes com o mesmo nome JSON. O Jackson lançará erro de “ambiguous property”.
    - Se houver heranças, certifique-se de não mapear dois filhos para o mesmo nome JSON.
6. **Trate Propriedades Sensíveis com Access Control**
    - Sempre que manipular senhas, tokens ou informações confidenciais, configure `access = WRITE_ONLY` para impedir exposição na serialização:
        
        ```java
        @JsonProperty(value = "password", access = JsonProperty.Access.WRITE_ONLY)
        private String senha;
        
        ```
        
7. **Valide Estrutura JSON Antes de Desserializar**
    - Use `@Valid` e `Bean Validation` em DTOs do Spring, garantindo que campos mapeados por `@JsonProperty` atendam restrições.
    - Exemplo:
        
        ```java
        public class UsuarioDTO {
            @NotBlank
            @JsonProperty("user_name")
            private String nome;
            // ...
        }
        
        ```
        
8. **Mantenha Consistência Entre Versões da API**
    - Se quer manter compatibilidade retroativa, use `@JsonAlias` para aceitar versões antigas:
        
        ```java
        @JsonProperty("full_name")
        @JsonAlias("nome_completo_v1")
        private String nome;
        
        ```
        

---

## Exemplo Prático Completo

### 1. Estrutura do Projeto

```
spring-boot-jackson-demo/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/demo/
│   │   │       ├── DemoApplication.java
│   │   │       ├── controller/
│   │   │       │   └── ProdutoController.java
│   │   │       └── model/
│   │   │           └── Produto.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/
│           └── com/example/demo/
│               └── ProdutoSerializationTest.java
└── pom.xml

```

### 2. Definição do Modelo (`Produto.java`)

```java
package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Representa um produto que será exposto via API.
 */
public class Produto {

    // Nome de campo Java: codigo
    // No JSON, será "product_id"
    @JsonProperty("product_id")
    private Long codigo;

    // Nome de campo Java: nome
    // No JSON, será "product_name"
    @JsonProperty("product_name")
    private String nome;

    // Esta propriedade só será escrita (desserializada) e não exposta (serializada)
    @JsonProperty(value = "secret_code", access = JsonProperty.Access.WRITE_ONLY)
    private String codigoSecreto;

    public Produto() { }

    public Produto(Long codigo, String nome, String codigoSecreto) {
        this.codigo = codigo;
        this.nome = nome;
        this.codigoSecreto = codigoSecreto;
    }

    public Long getCodigo() {
        return codigo;
    }

    public void setCodigo(Long codigo) {
        this.codigo = codigo;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCodigoSecreto() {
        return codigoSecreto;
    }

    public void setCodigoSecreto(String codigoSecreto) {
        this.codigoSecreto = codigoSecreto;
    }
}

```

### 3. Controller REST (`ProdutoController.java`)

```java
package com.example.demo.controller;

import com.example.demo.model.Produto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    // Endpoint para criar um produto (desserialização do JSON de entrada)
    @PostMapping
    public ResponseEntity<String> criarProduto(@RequestBody Produto produto) {
        // Exemplo simplificado: apenas retorna uma mensagem confirmando recepção.
        return new ResponseEntity<>(
            "Produto recebido: ID=" + produto.getCodigo() +
            ", Nome=" + produto.getNome() +
            ", SecretCode=" + produto.getCodigoSecreto(),
            HttpStatus.CREATED
        );
    }

    // Endpoint para obter produto de exemplo (serialização para JSON)
    @GetMapping("/{id}")
    public ResponseEntity<Produto> obterProdutoExemplo(@PathVariable Long id) {
        // Simula produto recuperado do banco
        Produto p = new Produto(id, "Cadeira de Escritório", "XYZ123");
        return new ResponseEntity<>(p, HttpStatus.OK);
    }
}

```

- **Observações**:
    - Ao chamar `GET /api/produtos/42`, o JSON retornado será:
        
        ```json
        {
          "product_id": 42,
          "product_name": "Cadeira de Escritório"
        }
        
        ```
        
        Note que `secret_code` não aparece por ser `WRITE_ONLY`.
        
    - Ao chamar `POST /api/produtos` com payload:
        
        ```json
        {
          "product_id": 55,
          "product_name": "Mesa",
          "secret_code": "ABC987"
        }
        
        ```
        
        O Jackson irá mapear para `Produto.codigo = 55`, `Produto.nome = "Mesa"` e `Produto.codigoSecreto = "ABC987"`.
        

### 4. Configuração (Opcional) no `application.properties`

Caso deseje que todas as propriedades Java em `camelCase` virem `snake_case` sem anotar individualmente:

```
spring.jackson.property-naming-strategy= SNAKE_CASE

```

Mas, como neste exemplo usamos `@JsonProperty` explicitamente, essa configuração não é estritamente necessária.

### 5. Teste de Serialização/Desserialização (`ProdutoSerializationTest.java`)

```java
package com.example.demo;

import com.example.demo.model.Produto;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ProdutoSerializationTest {

    private final ObjectMapper mapper = new ObjectMapper();

    @Test
    void testeSerializacao() throws Exception {
        Produto p = new Produto(10L, "Notebook", "TOPSECRET");
        String json = mapper.writeValueAsString(p);

        // Verifica que o JSON contenha apenas "product_id" e "product_name"
        assertTrue(json.contains("\"product_id\":10"));
        assertTrue(json.contains("\"product_name\":\"Notebook\""));
        assertFalse(json.contains("secret_code"));
    }

    @Test
    void testeDesserializacao() throws Exception {
        String json = "{\"product_id\":20,\"product_name\":\"Mouse\",\"secret_code\":\"XYZ\"}";
        Produto p = mapper.readValue(json, Produto.class);

        assertEquals(20L, p.getCodigo());
        assertEquals("Mouse", p.getNome());
        assertEquals("XYZ", p.getCodigoSecreto());
    }
}

```

---

## Cenários de Restrição ou Não Aplicação

1. **Uso de Naming Strategy Global**
    - Se toda a aplicação utiliza `snake_case`, evitar anotar cada campo; configure globalmente no `ObjectMapper` ou `application.properties`.
2. **Classes de Terceiros (Sem Fonte)**
    - Para objetos de bibliotecas externas, anotações diretas não são possíveis. Use *Mixins*:
        
        ```java
        public abstract class TerceiroMixIn {
            @JsonProperty("external_id")
            abstract String getId();
        }
        
        mapper.addMixIn(ClasseExterna.class, TerceiroMixIn.class);
        
        ```
        
3. **Campos Calculados ou Transientes**
    - Se a propriedade não for parte do modelo de dados base, considere usar `@JsonIgnore` ou métodos `getXYZ()` no lugar de campos.
4. **Performance**
    - Em casos de serialização massiva (bulk), muitos campos anotados podem gerar sobrecarga na introspecção. Prefira estratégias globais ou serializers customizados, conforme necessidade.

---

## Componentes Chave Associados

1. **`ObjectMapper`**
    - Classe central do Jackson. Todas as anotações como `@JsonProperty`, `@JsonIgnore`, etc., são processadas aqui.
2. **`Jackson2ObjectMapperBuilder` (Spring Boot)**
    - Facilita a configuração do `ObjectMapper` no contexto Spring:
        
        ```java
        @Bean
        public Jackson2ObjectMapperBuilderCustomizer customizer() {
            return builder -> {
                builder.propertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
                builder.serializationInclusion(JsonInclude.Include.NON_NULL);
            };
        }
        
        ```
        
3. **`@JsonIgnore`**
    - Oposto de `@JsonProperty`: define que um campo não será nem serializado nem desserializado.
4. **`@JsonInclude`**
    - Controla se valores `null` ou vazios devem aparecer no JSON.
    - Exemplo:
        
        ```java
        @JsonInclude(JsonInclude.Include.NON_EMPTY)
        private String descricao;
        
        ```
        
5. **`@JsonAlias`**
    - Permite múltiplos nomes de entrada:
        
        ```java
        @JsonAlias({"birth_date", "data_nasc"})
        private LocalDate dataNascimento;
        
        ```
        
6. **`@JsonCreator`**
    - Indica qual construtor Jackson deve usar para desserializar:
        
        ```java
        @JsonCreator
        public Usuario(@JsonProperty("id") Long id,
                       @JsonProperty("nome") String nome) { ... }
        
        ```
        
7. **Serializers/Deserializers Customizados**
    - Quando há tipos especiais (por ex. `LocalDate` com formato específico), registra-se:
        
        ```java
        SimpleModule module = new SimpleModule();
        module.addSerializer(LocalDate.class, new LocalDateSerializer(DateTimeFormatter.ISO_DATE));
        mapper.registerModule(module);
        
        ```
        

---

## Melhores Práticas e Padrões de Uso

1. **Consistência de Convenções**
    - Defina se a API verá `snake_case`, `camelCase` ou outro estilo. Utilize naming strategy global quando possível.
    - Exemplo no Spring Boot:
        
        ```java
        spring.jackson.property-naming-strategy=SNAKE_CASE
        
        ```
        
2. **Anote Apenas o Necessário**
    - Em vez de anotar todos os campos, prefira anotar somente as exceções à convenção global.
3. **Documente o Contrato (Swagger/OpenAPI)**
    - Ao usar `@JsonProperty`, as ferramentas de geração de documentação (por ex. Springdoc) capturam automaticamente os nomes definidos.
4. **Trate Propriedades Sensíveis com Cuidado**
    - Use `access = WRITE_ONLY` para senhas, tokens ou dados que não devem vazar pela API.
5. **Evite Nomes Conflitantes**
    - Cada chave JSON mapeada para um DTO deve ser única. Se a classe herda campos de superclass, garanta que não haja sobreposição.
6. **Teste de Serialização e Desserialização**
    - Crie testes unitários para confirmar que `@JsonProperty` mapeia corretamente.
    - Verifique cenários de ausência de chave, valores nulos e múltiplos aliases.
7. **Validação de Entradas**
    - Combine `@JsonProperty` com Bean Validation (`@NotNull`, `@Size`, etc.) para garantir que JSON inválido seja rejeitado antes de lógica de negócio.
8. **Uso de Mixins Quando Não Há Fonte**
    - Para bibliotecas de terceiros, utilize *MixIn Annotations* para acrescentar `@JsonProperty` sem alterar código-fonte original.

---

## Exemplo Prático Completo

### 1. Caso de Uso

Imagine uma API de catálogo de produtos em que:

- Campos internos em Java seguem `camelCase`.
- O cliente JavaScript exige nomes em `snake_case`.
- O campo `secretCode` não deve ser retornado ao cliente.

### 2. Definição dos DTOs e Entidades

### 2.1. `src/main/java/com/example/demo/model/Produto.java`

```java
package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO/Entidade que representa um produto no sistema.
 */
@JsonInclude(JsonInclude.Include.NON_NULL) // Omite campos nulos na serialização
public class Produto {

    @JsonProperty("product_id") // Nome JSON diferente do campo Java
    private Long id;

    @JsonProperty("product_name")
    private String nome;

    @JsonProperty(value = "price_usd") // Separado em snake_case e sublinhado
    private Double preco;

    @JsonProperty(value = "secret_code", access = JsonProperty.Access.WRITE_ONLY)
    private String codigoSecreto;

    public Produto() { }

    public Produto(Long id, String nome, Double preco, String codigoSecreto) {
        this.id = id;
        this.nome = nome;
        this.preco = preco;
        this.codigoSecreto = codigoSecreto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Double getPreco() {
        return preco;
    }

    public void setPreco(Double preco) {
        this.preco = preco;
    }

    public String getCodigoSecreto() {
        return codigoSecreto;
    }

    public void setCodigoSecreto(String codigoSecreto) {
        this.codigoSecreto = codigoSecreto;
    }
}

```

### 2.2. `src/main/java/com/example/demo/controller/ProdutoController.java`

```java
package com.example.demo.controller;

import com.example.demo.model.Produto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    /**
     * Exemplo de endpoint que retorna um produto fixo.
     * Note como o JSON será formatado conforme @JsonProperty.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Produto> obterProduto(@PathVariable Long id) {
        // Simulação de busca no repositório
        Produto p = new Produto(id, "Teclado Mecânico", 150.0, "SECRET123");
        return new ResponseEntity<>(p, HttpStatus.OK);
    }

    /**
     * Cria um novo produto a partir de JSON de entrada.
     * A desserialização respeita @JsonProperty e o campo secret_code
     * será mapeado, mesmo não sendo retornado na resposta.
     */
    @PostMapping
    public ResponseEntity<String> criarProduto(@RequestBody Produto produto) {
        // Simula gravação no banco e retorna mensagem de sucesso
        String msg = String.format(
            "Produto criado: ID=%d, Nome=%s, Preço=%.2f, SecretCode=%s",
            produto.getId(), produto.getNome(), produto.getPreco(), produto.getCodigoSecreto()
        );
        return new ResponseEntity<>(msg, HttpStatus.CREATED);
    }
}

```

### 3. Configurações do Spring Boot

### 3.1. `src/main/resources/application.properties`

```
# Configura Jackson para usar snake_case em toda a aplicação (opcional,
# pois já anotamos campos individualmente)
spring.jackson.property-naming-strategy= SNAKE_CASE

# Exemplo: remove serialização de propriedades nulas globalmente
spring.jackson.default-property-inclusion=non_null

```

### 4. Testes Unitários

### 4.1. `src/test/java/com/example/demo/ProdutoSerializationTest.java`

```java
package com.example.demo;

import com.example.demo.model.Produto;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ProdutoSerializationTest {

    private final ObjectMapper mapper = new ObjectMapper();

    @Test
    void quandoSerializar_entaoUsaNomesDefinidos() throws Exception {
        Produto p = new Produto(1L, "Mouse Óptico", 50.0, "ABC123");
        String json = mapper.writeValueAsString(p);

        // Confirma chaves conforme @JsonProperty
        assertTrue(json.contains("\"product_id\":1"));
        assertTrue(json.contains("\"product_name\":\"Mouse Óptico\""));
        assertTrue(json.contains("\"price_usd\":50.0"));

        // Secret_code não deve aparecer por ser WRITE_ONLY
        assertFalse(json.contains("secret_code"));
    }

    @Test
    void quandoDesserializar_entaoMapeiaCorretamente() throws Exception {
        String json = "{\"product_id\":2,\"product_name\":\"Monitor\",\"price_usd\":200.0,\"secret_code\":\"XYZ\"}";
        Produto p = mapper.readValue(json, Produto.class);

        assertEquals(2L, p.getId());
        assertEquals("Monitor", p.getNome());
        assertEquals(200.0, p.getPreco());
        assertEquals("XYZ", p.getCodigoSecreto());
    }
}

```

### 5. Execução e Teste Manual

1. **Rodar a aplicação** (`mvn spring-boot:run`).
2. **GET** em `http://localhost:8080/api/produtos/5`:
    
    ```json
    {
      "product_id": 5,
      "product_name": "Teclado Mecânico",
      "price_usd": 150.0
    }
    
    ```
    
    Observe que `"secret_code"` não aparece.
    
3. **POST** em `http://localhost:8080/api/produtos` com corpo:
    
    ```json
    {
      "product_id": 10,
      "product_name": "Webcam HD",
      "price_usd": 120.5,
      "secret_code": "ABC999"
    }
    
    ```
    
    - Resposta (texto simples):
        
        ```
        Produto criado: ID=10, Nome=Webcam HD, Preço=120.50, SecretCode=ABC999
        
        ```
        

---

## Sugestões para Aprofundamento

1. **Documentação Oficial Jackson**
    - Guia de Anotações:
        
        [https://github.com/FasterXML/jackson-annotations](https://github.com/FasterXML/jackson-annotations)
        
    - Módulo `jackson-databind`:
        
        [https://github.com/FasterXML/jackson-databind](https://github.com/FasterXML/jackson-databind)
        
2. **Naming Strategies**
    - `PropertyNamingStrategies` (ex.: `SNAKE_CASE`, `LOWER_CAMEL_CASE`, `UPPER_CAMEL_CASE`).
    - Documentação Spring:
        
        [https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/http/converter/json/Jackson2ObjectMapperBuilder.html](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/http/converter/json/Jackson2ObjectMapperBuilder.html)
        
3. **MixIn Annotations**
    - Para casos em que não há acesso ao código-fonte.
    - Tutorial:
        
        [https://www.baeldung.com/jackson-mixins](https://www.baeldung.com/jackson-mixins)
        
4. **Serializadores e Desserializadores Customizados**
    - Quando lidar com formatos específicos (ex.: datas em padrão não ISO).
    - Artigo:
        
        [https://www.baeldung.com/jackson-custom-serialization](https://www.baeldung.com/jackson-custom-serialization)
        
5. **Integração com Bean Validation**
    - Uso conjunto de anotações Jackson e `javax.validation` (`@NotNull`, `@Size`, etc.).
    - Exemplos:
        
        [https://www.baeldung.com/spring-boot-bean-validation](https://www.baeldung.com/spring-boot-bean-validation)
        
6. **Benchmarking de Serialização**
    - Para aplicativos de alta performance, comparar Jackson vs. outras bibliotecas (Gson, Moshi).
    - Guia:
        
        [https://www.baeldung.com/jackson-vs-gson](https://www.baeldung.com/jackson-vs-gson)
        
7. **OpenAPI/Swagger com `@JsonProperty`**
    - Garantir que a documentação gerada reflita os nomes JSON corretos.
    - Dependências:
        - `springdoc-openapi-ui`
        - `springdoc-openapi-data-rest`
8. **Padrões Avançados de Configuração**
    - Configurar módulos para Java 8 (JSR-310), Kotlin, Joda-Time, etc.
    - Documentação de módulos Jackson:
        
        [https://github.com/FasterXML/jackson-modules-java8](https://github.com/FasterXML/jackson-modules-java8)
        

---

> Resumo:
> 
> 
> A anotação `@JsonProperty` é fundamental quando precisamos de controle preciso sobre nomes de propriedades no JSON em aplicações Spring Boot com Java. Com ela, garantimos compatibilidade de contratos, maior clareza e flexibilidade ao lidar com diferentes convenções de nomenclatura. Neste guia, cobrimos desde conceitos básicos até um exemplo completo, passando por melhores práticas e cenários de restrição, preparando você para utilizar Jackson de forma eficaz no seu próximo projeto.
>