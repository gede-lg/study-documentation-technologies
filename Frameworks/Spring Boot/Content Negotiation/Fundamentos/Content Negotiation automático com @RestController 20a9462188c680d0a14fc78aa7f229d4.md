# Content Negotiation automático com @RestController

---

## Introdução

O *Content Negotiation* (negociação de conteúdo) em aplicações REST diz respeito à capacidade de um servidor escolher o formato de representação de uma resposta (JSON, XML, YAML etc.) com base nas preferências informadas pelo cliente (via cabeçalho `Accept`, extensão de URL, parâmetros de consulta etc.). No ecossistema Spring Boot, a negociação de conteúdo é tratada automaticamente quando se utiliza a anotação `@RestController` (ou `@Controller` junto com `@ResponseBody`), por meio dos *HttpMessageConverters* configurados por padrão.

Este documento apresenta uma visão detalhada de como o Spring Boot realiza essa negociação sem a necessidade de configurações adicionais, além de ilustrar a sintaxe, componentes chave, melhores práticas e cenários em que ela não se aplica.

---

## Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conceitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    1. [Configuração Padrão do Spring Boot](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#configura%C3%A7%C3%A3o-padr%C3%A3o-do-spring-boot)
    2. [Uso de `@RequestMapping(produces = …)`](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#uso-de-requestmappingproduces-%E2%80%93)
    3. [Exemplos de Requisições com CURL](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplos-de-requisi%C3%A7%C3%B5es-com-curl)
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## Conceitos Fundamentais

1. **O que é Content Negotiation?**
    - É o processo pelo qual o servidor escolhe, dentre várias representações possíveis de um recurso, aquela que melhor satisfaz as preferências do cliente.
    - Normalmente, o cliente envia no cabeçalho HTTP `Accept` os tipos MIME (por exemplo, `application/json`, `application/xml`) que aceita.
    - O servidor avalia esse cabeçalho e seleciona um `HttpMessageConverter` capaz de serializar o objeto Java para o formato desejado.
2. **Importância no Contexto RESTful**
    - Em arquiteturas REST, a flexibilidade de retornar dados em diferentes formatos sem alterar a lógica de negócio é fundamental.
    - Permite publicar uma mesma API para consumidores variados: browsers, aplicações mobile, integrações internas etc.
3. **Como Funciona Automaticamente com `@RestController`**
    - Ao usar `@RestController`, o Spring Boot, por padrão, registra vários *HttpMessageConverters* (p. ex. `MappingJackson2HttpMessageConverter` para JSON, `Jaxb2RootElementHttpMessageConverter` para XML, entre outros).
    - Quando um método de controle retorna um objeto (POJO, `List<?>`, etc.), o Spring examina o cabeçalho `Accept` da requisição e escolhe o converter adequado.
    - Se o cliente não enviar `Accept` ou enviar `/*`, o Spring utiliza a *preferência interna* (normalmente JSON) ou a ordem definida em `ContentNegotiationConfigurer`.

---

## Sintaxe Detalhada e Uso Prático

### 1. Configuração Padrão do Spring Boot

Por convenção, o Spring Boot já inclui, no auto-*classpath*, as dependências para JSON (Jackson). Se adicionarmos a dependência de JAXB (por exemplo, `spring-boot-starter-web` + biblioteca `jaxb-api` ou `spring-boot-starter-xml`), o suporte a XML também estará disponível sem configurações adicionais.

```xml
<!-- Exemplo de pom.xml contendo starter-web (JSON) e starter-xml (XML) -->
<dependencies>
    <!-- Dependência para construir APIs REST (inclui Jackson) -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- Dependência opcional para suporte a XML (JAXB) -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-xml</artifactId>
    </dependency>
</dependencies>

```

- **HttpMessageConverters padrão incluídos pelo Spring Boot**
    1. `MappingJackson2HttpMessageConverter` → Serialização / Desserialização JSON via Jackson.
    2. `Jaxb2RootElementHttpMessageConverter` → Serialização / Desserialização XML via JAXB (se a biblioteca estiver presente).
    3. Eventuais outros converters (p. ex. para Protobuf, YAML, se configurados).
- **Exemplo de `@RestController` sem configurações extras**
    
    ```java
    @RestController
    @RequestMapping("/api/produtos")
    public class ProdutoController {
    
        // Objeto de exemplo
        public static class Produto {
            private Long id;
            private String nome;
            private Double preco;
    
            // Construtores, getters e setters omitidos para brevidade
        }
    
        @GetMapping("/{id}")
        public Produto obterProduto(@PathVariable Long id) {
            // Em um cenário real, buscaria do banco de dados.
            return new Produto(id, "Produto Exemplo", 123.45);
        }
    }
    
    ```
    
    - **Fluxo de negociação de conteúdo:**
        1. Cliente faz `GET /api/produtos/1` sem informar `Accept` → Spring retorna JSON (configuração padrão).
        2. Cliente faz `GET /api/produtos/1` com `Accept: application/xml` → Spring usa o conversor JAXB e retorna XML.

### 2. Uso de `@RequestMapping(produces = …)`

Embora o Spring já negocie automaticamente, é comum restringir explicitamente quais formatos um método pode produzir. Para isso, usa-se o atributo `produces`.

```java
@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    @GetMapping(
        path = "/{id}",
        produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE }
    )
    public Produto obterProduto(@PathVariable Long id) {
        return new Produto(id, "Produto Exemplo", 123.45);
    }

    // Método que produz apenas JSON, indiferente ao Accept
    @GetMapping(path = "/somente-json/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public Produto obterProdutoJson(@PathVariable Long id) {
        return new Produto(id, "Apenas JSON", 999.99);
    }
}

```

- **Explicação:**
    - Se o cliente pedir `Accept: application/xml` para `/api/produtos/{id}`, o método que permite ambos (`produces = { …xml, …json }`) retornará XML.
    - Se o cliente pedir `/api/produtos/somente-json/{id}` com `Accept: application/xml`, receberá **406 Not Acceptable** (pois o endpoint só produz JSON).

### 3. Exemplos de Requisições com CURL

1. **Requisição sem `Accept` (retorna JSON padrão):**
    
    ```bash
    curl -i http://localhost:8080/api/produtos/1
    
    ```
    
    - **Resposta esperada (JSON):**
        
        ```
        HTTP/1.1 200 OK
        Content-Type: application/json
        ...
        
        {
          "id": 1,
          "nome": "Produto Exemplo",
          "preco": 123.45
        }
        
        ```
        
2. **Requisição pedindo XML via cabeçalho `Accept`:**
    
    ```bash
    curl -i -H "Accept: application/xml" http://localhost:8080/api/produtos/1
    
    ```
    
    - **Resposta esperada (XML):**
        
        ```
        HTTP/1.1 200 OK
        Content-Type: application/xml
        ...
        
        <Produto>
            <id>1</id>
            <nome>Produto Exemplo</nome>
            <preco>123.45</preco>
        </Produto>
        
        ```
        
3. **Forçando `produces=application/json` mesmo com `Accept: application/xml`:**
    
    ```bash
    curl -i -H "Accept: application/xml" http://localhost:8080/api/produtos/somente-json/1
    
    ```
    
    - **Resposta esperada:**
        
        ```
        HTTP/1.1 406 Not Acceptable
        ...
        
        ```
        
    - Explicação: o método só produz JSON, logo não há autorização para retornar XML.

---

## Cenários de Restrição ou Não Aplicação

1. **Quando não usar Content Negotiation automática**
    - **APIs internas estritamente JSON:** Se todos os consumidores concordam em JSON e não há previsão de precisar de outro formato, é melhor desabilitar negociações extras e padronizar para JSON — simplifica testes e configuração.
    - **Microserviços de alto desempenho onde a sobrecarga de múltiplos conversores não é desejada:** Evitar carregar conversores desnecessários (por exemplo, removendo dependências de XML) reduz tempo de inicialização.
2. **Quando pode gerar ambiguidade ou impacto na performance**
    - **Uso de extensão de arquivo na URL (ex.: `/api/produtos/1.xml`):** Pode conflitar com roteamento ou caches intermediários.
    - **Múltiplos conversores configurados manualmente sem necessidade:** O Spring tentará identificar o melhor conversor com base em ordem e afinidade, o que pode atrasar a resposta se muitos conversores estiverem registrados.
3. **Cenários onde o cliente não respeita `Accept`**
    - Alguns clientes (browsers antigos ou scripts simples) não enviam `Accept` adequado. Neste caso, é recomendável definir um formato padrão explícito (por exemplo, JSON) e, se necessário, saturar o parâmetro de consulta (`?format=xml` ou `?format=json`) para forçar formatação.

---

## Componentes Chave Associados

1. **`ContentNegotiationManager`**
    - Classe que centraliza as regras de negociação.
    - Permite configurar estratégias de resolução: análise de extensão (`.json`, `.xml`), parâmetros de consulta (`?format=xml`), header `Accept`, entre outros.
    - Pode ser customizado via implementação de interface `ContentNegotiationConfigurer` em um `@Configuration`.
2. **`ContentNegotiationConfigurer`**
    - Utilizado dentro de uma classe anotada com `@Configuration` que implementa `WebMvcConfigurer`:
        
        ```java
        @Configuration
        public class WebConfig implements WebMvcConfigurer {
            @Override
            public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
                configurer
                    .favorParameter(true)           // usa ?format=xml ou ?format=json
                    .parameterName("format")
                    .ignoreAcceptHeader(false)      // respeita cabeçalho Accept
                    .defaultContentType(MediaType.APPLICATION_JSON)
                    .mediaType("xml", MediaType.APPLICATION_XML)
                    .mediaType("json", MediaType.APPLICATION_JSON);
            }
        }
        
        ```
        
    - **Principais métodos:**
        - `favorPathExtension(boolean)` — Habilita uso de extensão de arquivo na URL.
        - `favorParameter(boolean)` & `parameterName(String)` — Habilita uso de parâmetro de query para indicar formato.
        - `ignoreAcceptHeader(boolean)` — Se `true`, ignora cabeçalho `Accept`.
        - `defaultContentType(MediaType…)` — Define tipo padrão.
        - `mediaType(String, MediaType)` — Associa extensão ou valor do parâmetro a um `MediaType`.
3. **`HttpMessageConverter<?>`**
    - Interface que define métodos de conversão de objetos Java para formatos textuais ou binários e vice-versa.
    - **Implementações principais no Spring Boot:**
        - `MappingJackson2HttpMessageConverter` → JSON via Jackson.
        - `Jaxb2RootElementHttpMessageConverter` → XML via JAXB (quando dependência disponível).
        - Outros possíveis: `StringHttpMessageConverter`, `ByteArrayHttpMessageConverter`, `ProtobufHttpMessageConverter` (dependendo do classpath).
4. **Anotações Relacionadas**
    - `@RestController` → Combina `@Controller` + `@ResponseBody`. Indica que todos os métodos retornam corpo de resposta serializado pelo Spring, não view.
    - `@RequestMapping`, `@GetMapping`, `@PostMapping` etc. →
        - `produces` → Define quais tipos MIME o método pode produzir.
        - `consumes` → Define quais tipos MIME o método espera receber no corpo da requisição.
5. **Classes de Configuração (Opcional)**
    - `WebMvcConfigurer` → Interface que permite customizar diversos aspectos do Spring MVC, inclusive o content negotiation (via `configureContentNegotiation`).
    - `WebMvcRegistrations` (avançado) → Em casos de customização profunda de como converter objetos ou detectar controladores.

---

## Melhores Práticas e Padrões de Uso

1. **Defina um formato padrão claro**
    - Configure `defaultContentType(MediaType.APPLICATION_JSON)` para garantir que, na ausência de um `Accept` explícito, o servidor retorne JSON.
    - Exemplo:
        
        ```java
        @Override
        public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
            configurer
                .ignoreAcceptHeader(false)
                .defaultContentType(MediaType.APPLICATION_JSON);
        }
        
        ```
        
2. **Evite confiar em extensão de arquivo (`.json`, `.xml`) para produção**
    - Muitos gateways, proxies e caches podem ter regras próprias sobre extensão de arquivo que interferem na lógica da API.
    - Prefira usar cabeçalhos ou parâmetros de consulta (`?format=xml`) se for realmente necessário.
3. **Use `produces` e `consumes` de forma explícita quando necessário**
    - Se um endpoint só deve retornar JSON (porque, por exemplo, o cliente não suporta XML), especifique `produces = MediaType.APPLICATION_JSON_VALUE`.
    - Se um endpoint só aceita upload de JSON, use `consumes = MediaType.APPLICATION_JSON_VALUE`.
4. **Organize as dependências de conversores de modo conciso**
    - Remova do `pom.xml`/`build.gradle` dependências de formatos que não serão usados para evitar o carregamento desnecessário de conversores.
    - Exemplo: se você não vai produzir XML, não inclua `spring-boot-starter-xml`.
5. **Lembre-se da audiência da API**
    - Se a API for consumida apenas por front-end moderno (Angular, React, Flutter etc.), possivelmente só JSON será suficiente.
    - Se for disponibilizar para terceiros ou integração com sistemas legados, ofereça XML também ou documentação clara sobre como requisitar formatos diferentes.
6. **Testes Automatizados**
    - Crie testes que validem as respostas para diferentes valores de `Accept`.
    - Utilize o `MockMvc` para simular requisições com cabeçalho `Accept` e verificar se o conteúdo retornado corresponde ao esperado:
        
        ```java
        @Autowired
        private MockMvc mockMvc;
        
        @Test
        public void deveRetornarXmlQuandoAcceptForXml() throws Exception {
            mockMvc.perform(
                get("/api/produtos/1")
                .accept(MediaType.APPLICATION_XML)
            )
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_XML))
            .andExpect(xpath("/Produto/nome").string("Produto Exemplo"));
        }
        
        ```
        

---

## Exemplo Prático Completo

A seguir, um projeto Spring Boot mínimo que demonstra **negociação automática** entre JSON e XML usando `@RestController`:

1. **Estrutura de Pastas**
    
    ```
    src
    └── main
        ├── java
        │   └── com
        │       └── exemplo
        │           ├── DemoApplication.java
        │           ├── config
        │           │   └── WebConfig.java
        │           └── controller
        │               └── ProdutoController.java
        └── resources
            └── application.properties
    
    ```
    
2. **`pom.xml`**
    
    ```xml
    <project ...>
        <modelVersion>4.0.0</modelVersion>
        <groupId>com.exemplo</groupId>
        <artifactId>demo</artifactId>
        <version>0.0.1-SNAPSHOT</version>
        <packaging>jar</packaging>
    
        <parent>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-parent</artifactId>
            <version>3.1.2</version>
        </parent>
    
        <dependencies>
            <!-- Spring Boot Web (inclui Jackson para JSON) -->
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-web</artifactId>
            </dependency>
    
            <!-- Suporte a XML via JAXB -->
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-xml</artifactId>
            </dependency>
    
            <!-- Para testes -->
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-test</artifactId>
                <scope>test</scope>
            </dependency>
        </dependencies>
    
        <properties>
            <java.version>17</java.version>
        </properties>
    </project>
    
    ```
    
3. **`DemoApplication.java`**
    
    ```java
    package com.exemplo;
    
    import org.springframework.boot.SpringApplication;
    import org.springframework.boot.autoconfigure.SpringBootApplication;
    
    @SpringBootApplication
    public class DemoApplication {
        public static void main(String[] args) {
            SpringApplication.run(DemoApplication.class, args);
        }
    }
    
    ```
    
4. **`WebConfig.java`** (opcional: customiza o comportamento de negociação)
    
    ```java
    package com.exemplo.config;
    
    import org.springframework.context.annotation.Configuration;
    import org.springframework.http.MediaType;
    import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
    import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
    
    @Configuration
    public class WebConfig implements WebMvcConfigurer {
        @Override
        public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
            configurer
                .favorParameter(true)                   // Habilita ?format=xml ou ?format=json
                .parameterName("format")
                .ignoreAcceptHeader(false)              // Respeita cabeçalho Accept
                .defaultContentType(MediaType.APPLICATION_JSON)
                .mediaType("json", MediaType.APPLICATION_JSON)
                .mediaType("xml", MediaType.APPLICATION_XML);
        }
    }
    
    ```
    
5. **`ProdutoController.java`**
    
    ```java
    package com.exemplo.controller;
    
    import jakarta.xml.bind.annotation.XmlRootElement;
    import org.springframework.http.MediaType;
    import org.springframework.web.bind.annotation.*;
    
    @RestController
    @RequestMapping("/api/produtos")
    public class ProdutoController {
    
        // Classe interna para representar o produto
        @XmlRootElement(name = "Produto") // Necessária para serialização em XML
        public static class Produto {
            private Long id;
            private String nome;
            private Double preco;
    
            // Construtor default (necessário para JAXB)
            public Produto() { }
    
            public Produto(Long id, String nome, Double preco) {
                this.id = id;
                this.nome = nome;
                this.preco = preco;
            }
    
            // Getters e setters
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
        }
    
        /**
         * Endpoint que aceita JSON ou XML conforme o cabeçalho 'Accept' ou parâmetro 'format'.
         * Exemplo de chamadas:
         *   - GET /api/produtos/1
         *   - GET /api/produtos/1?format=xml
         *   - GET /api/produtos/1 com cabeçalho Accept: application/xml
         */
        @GetMapping(
            path = "/{id}",
            produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE }
        )
        public Produto obterProduto(@PathVariable Long id) {
            // Retorna um objeto de exemplo
            return new Produto(id, "Produto Demo", 199.90);
        }
    
        /**
         * Endpoint que força retorno somente em JSON, mesmo se o cliente pedir XML.
         */
        @GetMapping(
            path = "/json/{id}",
            produces = MediaType.APPLICATION_JSON_VALUE
        )
        public Produto obterProdutoJsonSomente(@PathVariable Long id) {
            return new Produto(id, "Somente JSON", 49.90);
        }
    }
    
    ```
    
6. **`application.properties`** (opcional)
    
    ```
    # Porta padrão: 8080
    server.port=8080
    
    # Habilita logs de negociação de conteúdo (para depuração)
    logging.level.org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter=DEBUG
    
    ```
    
7. **Testando localmente**
    - Inicie a aplicação:
        
        ```
        mvn spring-boot:run
        
        ```
        
    - **Requisição JSON (padrão):**
        
        ```
        curl -i http://localhost:8080/api/produtos/1
        
        ```
        
        - Deve retornar JSON com `Content-Type: application/json`.
    - **Requisição XML via `Accept`:**
        
        ```
        curl -i -H "Accept: application/xml" http://localhost:8080/api/produtos/1
        
        ```
        
        - Deve retornar XML com `Content-Type: application/xml`.
    - **Requisição XML via parâmetro `format=xml`:**
        
        ```
        curl -i http://localhost:8080/api/produtos/1?format=xml
        
        ```
        
        - De acordo com a configuração em `WebConfig`, retorna XML mesmo sem `Accept`.
    - **Requisição que força JSON apesar de `Accept: application/xml`:**
        
        ```
        curl -i -H "Accept: application/xml" http://localhost:8080/api/produtos/json/1
        
        ```
        
        - Retorna `406 Not Acceptable` porque o método só produz JSON.

---

## Sugestões para Aprofundamento

1. **Documentação Oficial Spring**
    - [Spring Framework – Content Negotiation](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-config-content-negotiation)
    - [Spring Boot – How to override HTTP message converters](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#howto-overriding-the-message-converters)
2. **Boas Práticas**
    - Desabilite conversores não utilizados no `application.properties` ou via `WebMvcConfigurer` para melhorar performance.
    - Mantenha a consistência entre API pública (documentação/Swagger) e formatos suportados.
3. **Ferramentas de Teste**
    - Aprenda a usar o `MockMvc` para testar content negotiation.
    - Utilize Postman para verificar vários cenários de cabeçalhos `Accept` e parâmetros de consulta.
4. **Alternativas de Negociação**
    - **Parameter-based:** Quando `?format=json` ou `?format=xml` é suficiente.
    - **Path-extension based:** (embora seja desencorajado em produção).
    - **Custom Media Types:** Definir tipos como `application/vnd.exemplo.v1+json` para versionamento de APIs.

---

**Conclusão:**

O Spring Boot, por meio de `@RestController` e dos *HttpMessageConverters* configurados automaticamente, realiza content negotiation de forma transparente. Basta adicionar as dependências necessárias (JSON/XML) e, se desejar, customizar via `ContentNegotiationConfigurer`. Essa abordagem permite expor a mesma API em múltiplos formatos, atendendo a diferentes tipos de clientes sem duplicar lógica de negócio.