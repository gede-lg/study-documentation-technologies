# O Papel dos Cabeçalhos HTTP (Accept e Content-Type)

---

## 1. Visão Geral Concisa

Content Negotiation é o mecanismo pelo qual um servidor web e um cliente (“consumer”) acordam o formato dos dados trocados (por exemplo, JSON, XML, YAML). Em Spring Boot, isso se baseia principalmente nos cabeçalhos HTTP **Accept** (pedido do cliente) e **Content-Type** (tipo de mídia da resposta). O framework, por meio de **HttpMessageConverters**, analisa esses cabeçalhos e serializa/deserializa os objetos Java no formato apropriado, sem a necessidade de lógica manual de parsing.

---

## 2. Introdução

Content Negotiation (ou “negociação de conteúdo”) é um padrão da web que permite ao cliente solicitar um tipo específico de representação de um recurso (por exemplo, JSON vs. XML). No contexto de APIs RESTful, isso garante flexibilidade: diferentes consumidores (web, mobile, integrações legadas) podem trabalhar com o mesmo endpoint, recebendo a resposta no formato que melhor suportam.

No Spring Boot, Content Negotiation é tratado quase que automaticamente pelos **HttpMessageConverters**, que convertem objetos Java para e a partir dos formatos (JSON, XML, etc.) com base nos cabeçalhos HTTP trocados. A configuração padrão já lida com JSON via Jackson, mas, se necessário, podemos ajustar o comportamento, adicionar novos conversores ou modificar a prioridade de formatos.

---

## 3. Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conceitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    1. Exemplo de Controller (JSON e XML)
    2. Configuração de Dependências (.pom/.gradle)
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
    1. HttpMessageConverters
    2. ContentNegotiationConfigurer
    3. Anotações (@RequestMapping, @GetMapping, produces/consumes)
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
    1. Estrutura do Projeto
    2. Controller de Exemplo
    3. Testes de Aceitabilidade (curl ou Postman)
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## 4. Conceitos Fundamentais

### 4.1. O que é Content Negotiation?

- **Definição:** Mecanismo HTTP que permite ao cliente especificar, via cabeçalhos, o formato da resposta desejada.
- **Objetivo:** Tornar APIs RESTful mais flexíveis, fornecendo múltiplas representações de um mesmo recurso sem endpoints distintos.

### 4.2. Cabeçalhos HTTP Principais

- **Accept:** Indica ao servidor quais tipos de mídia (MIME types) o cliente aceita. Exemplo:
    
    ```
    Accept: application/json
    Accept: application/xml;q=0.9, application/json;q=0.8
    
    ```
    
    - O parâmetro “q” (quality) informa preferência relativa.
- **Content-Type:** No contexto de resposta, indica o tipo de mídia efetivamente enviado pelo servidor. Exemplo:
    
    ```
    Content-Type: application/json;charset=UTF-8
    
    ```
    

### 4.3. Importância para APIs RESTful

- Atende diferentes clientes (ex.: front-end em Angular que consome JSON e integrações legadas que esperam XML).
- Facilita versionamento ou migração: um mesmo controller pode retornar JSON por padrão, mas ainda suportar XML para quem precisar.

---

## 5. Sintaxe Detalhada e Uso Prático

### 5.1. Dependências Essenciais (pom.xml)

Para suportar JSON (Jackson) e XML (Jackson XML ou JAXB) no Spring Boot, geralmente basta:

```xml
<!-- Dependência básica do Spring Boot Starter Web inclui Jackson para JSON -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- Para habilitar suporte a XML via Jackson XML -->
<dependency>
    <groupId>com.fasterxml.jackson.dataformat</groupId>
    <artifactId>jackson-dataformat-xml</artifactId>
</dependency>

```

Caso queira usar JAXB puro (em vez de Jackson XML):

```xml
<!-- Habilita o Jackson-bom para serializar via JAXB -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jersey</artifactId>
</dependency>

```

> Obs.: O Spring Boot, ao detectar no classpath um conversor de XML (Jackson XML ou JAXB), já registra automaticamente um HttpMessageConverter que suporta application/xml.
> 

### 5.2. Anotações no Controller

Na camada de endpoints (Controllers), usamos atributos como `produces` e `consumes` para explicitar quais formatos cada método suporta:

```java
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProdutoController {

    // Retorna JSON ou XML de acordo com o Accept do cliente
    @GetMapping(
        path = "/produtos/{id}",
        produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE }
    )
    public Produto buscarProduto(/* @PathVariable Long id */) {
        // ... busca o produto no banco de dados
        return new Produto(1L, "Caneta", 3.50);
    }

    // Aceita JSON ou XML no corpo da requisição e retorna a representação correspondente
    @PostMapping(
        path = "/produtos",
        consumes = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE },
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public Produto criarProduto(@RequestBody Produto novo) {
        // ... persiste o produto e retorna a entidade criada
        return novo;
    }

}

```

> Comentários nos exemplos:
> 
> - `produces` → lista de tipos de mídia que o método pode enviar.
> - `consumes` → lista de tipos de mídia que o método aceita no corpo (útil em POST/PUT).
> - Se `produces` não estiver explícito, o Spring delega ao **ContentNegotiationManager** e tenta satisfazer o `Accept` do cliente a partir dos conversores disponíveis.
> - Se `consumes` não estiver explícito, o Spring aceita, por padrão, todos os tipos registrados nos **HttpMessageConverters** (ou seja, JSON, XML, etc.).

### 5.3. Configuração Global de Content Negotiation

Caso seja necessário personalizar o comportamento (prioridade de formatos, parâmetros de query, extensão de URL), basta implementar `WebMvcConfigurer`:

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
        configurer
            // Desabilita uso de extensão de URL (e.g., ".json", ".xml")
            .favorPathExtension(false)
            // Habilita uso de parâmetro "format", ex: /produtos?format=xml
            .favorParameter(true)
            .parameterName("format")
            // Mapeia valores de parâmetro para tipos específicos
            .mediaType("json", MediaType.APPLICATION_JSON)
            .mediaType("xml", MediaType.APPLICATION_XML)
            // Define JSON como padrão caso nenhum header ou parâmetro seja especificado
            .defaultContentType(MediaType.APPLICATION_JSON);
    }
}

```

> Comentários:
> 
> - `favorPathExtension(false)` → desativa interpretação de extensão no path (por questões de segurança e ambiguidades).
> - `favorParameter(true)` e `parameterName("format")` → permitem que o cliente use `?format=xml` para solicitar XML.
> - `defaultContentType(...)` → define que, na ausência de `Accept`, retorne JSON.

---

## 6. Cenários de Restrição ou Não Aplicação

1. **APIs Altamente Especializadas em um Só Formato:**
    
    Se a aplicação só oferece JSON (ou só XML), não há necessidade de Content Negotiation avançado; basta omitir múltiplos `produces` e confiar no conversor JSON padrão.
    
2. **Legado Sem Controle de Cabeçalhos:**
    
    Se clientes antigos não permitem configurar `Accept` nem usar parâmetros de query, talvez seja melhor expor endpoints separados (por ex.: `/v1/produtos.json` e `/v1/produtos.xml`) — mas isso contorna as boas práticas de REST.
    
3. **Performance Muito Crítica em Escala Extrema:**
    
    Serialização dinâmica conforme cabeçalho acarreta custos. Em sistemas que geram bilhões de requisições, oferecer somente JSON como formato único simplifica processamento e caching de respostas.
    
4. **Serviços Internos Sem Exposição Para Clientes Diversos:**
    
    Se apenas outras partes do backend consomem a API (e todas entendem JSON), a negociação de conteúdo torna-se desnecessária.
    

---

## 7. Componentes Chave Associados

### 7.1. HttpMessageConverters

- **O que são:** Coleção de classes (`MappingJackson2HttpMessageConverter`, `Jaxb2RootElementHttpMessageConverter`, etc.) que convertem entre objetos Java e representações de HTTP (JSON, XML, texto, etc.).
- **Fluxo Simplificado:**
    1. **Cliente** envia requisição com cabeçalho `Accept: application/xml`.
    2. **Spring MVC** recebe a requisição e seleciona o método do Controller apropriado.
    3. Na resposta, ele analisa o valor de `Accept` e percorre a lista de `HttpMessageConverters` disponíveis.
    4. O `MappingJackson2XmlHttpMessageConverter` (caso disponível) suporta `application/xml`, converte o objeto Java para XML e define `Content-Type: application/xml`.
    5. Se `Accept` estiver ausente, o Spring usa a ordem padrão de conversores e envia JSON (por ser o primeiro preferido).

### 7.2. ContentNegotiationConfigurer e ContentNegotiationManager

- **ContentNegotiationConfigurer:** Classe de configuração fluente para personalizar comportamentos (favorPathExtension, favorParameter, defaultContentType, etc.).
- **ContentNegotiationManager:** Gerencia a lógica de decisão final do formato de saída, com base em cabeçalhos, parâmetros, extensões de URL e ordem de conversores.

### 7.3. Anotações “produces” e “consumes”

- **@RequestMapping(produces = {"...", "..."})** ou **@GetMapping(produces = ...)**: informa explicitamente quais MIME types o método pode produzir.
- **@RequestMapping(consumes = ...)** ou **@PostMapping(consumes = ...)**: define quais tipos de mídia o método aceita no corpo da requisição.
- Se essas anotações forem omitidas, o Spring considera todos os conversores registrados que “encaixem” no `Accept` e no tipo de retorno do método.

### 7.4. Dependências de Serialização

- **Jackson JSON (padrão em spring-boot-starter-web).**
- **Jackson XML:**
    - Classe principal: `com.fasterxml.jackson.dataformat.xml.XmlMapper`.
    - Conversor: `MappingJackson2XmlHttpMessageConverter`.
- **JAXB (caso prefira usar annotations `@XmlRootElement` em vez de Jackson):**
    - Conversor: `Jaxb2RootElementHttpMessageConverter`.
    - Dependências: `jakarta.xml.bind-api`, implementações (por exemplo, `org.glassfish.jaxb:jaxb-runtime`).

---

## 8. Melhores Práticas e Padrões de Uso

1. **Sempre Definir “produces” No Controller (Quando For Multiplo Formatos):**
    - Evita ambiguidades sobre que conversor o Spring deve usar.
    - Facilita a documentação e a manutenção; fica claro aos consumidores do endpoint quais formatos são suportados.
2. **Evitar Path Extensions Para Content Negotiation:**
    - Uso de `.favorPathExtension(false)` no `ContentNegotiationConfigurer`, já que extensões podem gerar problemas de segurança (exposição de arquivos estáticos) e ambiguidades (qual extensão, prioridade?).
3. **Seja Claro Nas Prioridades de Formatos:**
    - Configure `defaultContentType(MediaType.APPLICATION_JSON)` para garantir que, quando o cliente não enviar `Accept`, a aplicação retorne JSON. Isso reduz erros 406 (Not Acceptable).
    - Se necessário, permita parâmetro de query (`?format=xml`) para clientes que não controlam cabeçalhos HTTP.
4. **Evitar Suportar Formatos Obsoletos Sem Necessidade:**
    - Oferecer apenas JSON e, se estritamente necessário, XML. Suportar CSV, YAML ou outros pode complicar a manutenção e introduzir testes extras.
5. **Testar Cenários de Content Negotiation com Ferramentas de API (curl/Postman):**
    - Confirme resposta de cada endpoint com `curl -H "Accept: application/xml"`.
    - Verifique headers e payloads.
6. **Documentar a API (Swagger/OpenAPI):**
    - No `@Operation` (OpenAPI), especifique `produces = {"application/json", "application/xml"}` para cada operação, garantindo documentação clara.

---

## 9. Exemplo Prático Completo

A seguir, um projeto simplificado de Spring Boot que demonstra Content Negotiation retornando um **Produto** em JSON ou XML de acordo com o cabeçalho `Accept`.

### 9.1. Estrutura do Projeto

```
├── pom.xml
└── src
    └── main
        ├── java
        │   └── com.exemplo.negociacao
        │       ├── Application.java
        │       ├── config
        │       │   └── WebConfig.java
        │       ├── controller
        │       │   └── ProdutoController.java
        │       └── model
        │           └── Produto.java
        └── resources
            └── application.properties

```

### 9.1.1. pom.xml (dependências relevantes)

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" ...>
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.exemplo</groupId>
    <artifactId>negociacao-content</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <packaging>jar</packaging>

    <dependencies>
        <!-- Spring Boot Starter Web (inclui Jackson JSON) -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Jackson DataFormat XML para suporte a XML -->
        <dependency>
            <groupId>com.fasterxml.jackson.dataformat</groupId>
            <artifactId>jackson-dataformat-xml</artifactId>
        </dependency>

        <!-- (Opcional) Lombok para getters/setters automáticos -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- Testes -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <properties>
        <java.version>17</java.version>
        <spring.boot.version>3.1.0</spring.boot.version>
    </properties>

    <build>
        <plugins>
            <!-- Plugin do Spring Boot -->
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>

```

### 9.2. Application.java

```java
package com.exemplo.negociacao;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

```

### 9.3. WebConfig.java (Configuração de Content Negotiation)

```java
package com.exemplo.negociacao.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
        configurer
            .favorPathExtension(false)            // Não usar .json/.xml no URL
            .favorParameter(true)                 // Habilita ?format=xml ou ?format=json
            .parameterName("format")              // Nome do parâmetro a ser usado
            .mediaType("json", MediaType.APPLICATION_JSON)
            .mediaType("xml", MediaType.APPLICATION_XML)
            .defaultContentType(MediaType.APPLICATION_JSON);
    }
}

```

### 9.4. Produto.java (Modelo de Domínio)

```java
package com.exemplo.negociacao.model;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Annotation necessária para que Jackson XML crie a tag raiz <Produto> corretamente
@JacksonXmlRootElement(localName = "Produto")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Produto {
    private Long id;
    private String nome;
    private Double preco;
}

```

> Comentários:
> 
> - `@JacksonXmlRootElement(localName = "Produto")`: instrui Jackson XML a usar `<Produto>` como elemento raiz.
> - Usamos Lombok (`@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`) só para reduzir boilerplate (getters, setters, etc.). Caso não queira Lombok, crie manualmente construtor, getters e setters.

### 9.5. ProdutoController.java (Endpoint Exposto)

```java
package com.exemplo.negociacao.controller;

import com.exemplo.negociacao.model.Produto;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProdutoController {

    /**
     * Exemplo de GET /produto que retorna JSON ou XML
     * de acordo com o cabeçalho Accept do cliente
     */
    @GetMapping(
        path = "/produto",
        produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE }
    )
    public Produto buscarProduto() {
        // Em um cenário real, buscaríamos no banco de dados
        return new Produto(1L, "Caneta Esferográfica", 2.75);
    }
}

```

> Comentários Importantes:
> 
> - `produces = { ..., ... }`: Informa explicitamente que esse endpoint pode retornar JSON (“application/json”) ou XML (“application/xml”).
> - Se o cliente enviar `Accept: application/json`, a resposta virá JSON; se enviar `Accept: application/xml`, a resposta virá XML. Se não enviar `Accept`, cairá na **defaultContentType**, retornando JSON.

### 9.6. Pequena Demonstração com curl (Testando Content Negotiation)

1. **Requisição sem header Accept (usar default JSON):**
    
    ```bash
    curl -i http://localhost:8080/produto
    
    ```
    
    **Resposta esperada:**
    
    ```
    HTTP/1.1 200 OK
    Content-Type: application/json
    ...
    
    {
      "id": 1,
      "nome": "Caneta Esferográfica",
      "preco": 2.75
    }
    
    ```
    
2. **Requisição solicitando XML explicitamente:**
    
    ```bash
    curl -i -H "Accept: application/xml" http://localhost:8080/produto
    
    ```
    
    **Resposta esperada:**
    
    ```
    HTTP/1.1 200 OK
    Content-Type: application/xml
    ...
    
    <Produto>
      <id>1</id>
      <nome>Caneta Esferográfica</nome>
      <preco>2.75</preco>
    </Produto>
    
    ```
    
3. **Requisição usando parâmetro `format` (JSON):**
    
    ```bash
    curl -i http://localhost:8080/produto?format=json
    
    ```
    
    **Resposta desse modo:**
    
    ```
    HTTP/1.1 200 OK
    Content-Type: application/json
    ...
    {
      "id": 1,
      "nome": "Caneta Esferográfica",
      "preco": 2.75
    }
    
    ```
    
4. **Requisição usando parâmetro `format` (XML):**
    
    ```bash
    curl -i http://localhost:8080/produto?format=xml
    
    ```
    
    **Resposta esperada:**
    
    ```
    HTTP/1.1 200 OK
    Content-Type: application/xml
    ...
    <Produto>
      <id>1</id>
      <nome>Caneta Esferográfica</nome>
      <preco>2.75</preco>
    </Produto>
    
    ```
    

---

## 10. Sugestões para Aprofundamento

1. **Springfox / SpringDoc (OpenAPI) e Content Negotiation:**
    - Verifique como documentar diferentes “produces” em sua especificação OpenAPI/Swagger.
    - Exemplos:
        
        ```java
        @Operation(
          summary = "Busca produto",
          produces = {
            MediaType.APPLICATION_JSON_VALUE,
            MediaType.APPLICATION_XML_VALUE
          }
        )
        
        ```
        
2. **Outros Formatos (CSV, YAML):**
    - Pesquise bibliotecas como `jackson-dataformat-csv` e `jackson-dataformat-yaml` e como registrá-las como `HttpMessageConverters`.
    - Exemplo de configuração similar à do Jackson XML.
3. **Customização de Serialização com Jackson:**
    - Uso de `@JsonView`, `@JsonPropertyOrder`, `@JsonIgnore` para controlar dinâmica de campos em JSON.
    - Para XML, `@JacksonXmlProperty`, `@JacksonXmlElementWrapper`, etc.
4. **Intermediários / Avançados: Interceptadores e Filtros de Negociação:**
    - Implementar `HandlerInterceptor` ou `Filter` para pré-processar cabeçalhos, forçar formatos ou aplicar lógica personalizada (ex.: redirecionar para endpoints específicos).
5. **Controle de Versão via Content Negotiation:**
    - Algumas equipes usam um cabeçalho customizado (ex.: `Accept: application/vnd.meuapp.v2+json`) para versionar a API.
    - É possível configurar o `ContentNegotiationConfigurer` para reconhecer tipos MIME customizados.
6. **Desempenho e Caching com Content Negotiation:**
    - Pesquise como integrar ETags, Last-Modified e Cache-Control junto à Content Negotiation para reduzir uso de banda e latência.

---

### Conclusão

Neste guia, apresentamos uma **visão geral concisa** e uma explicação **detalhada** de Content Negotiation em Spring Boot, abordando o papel dos cabeçalhos HTTP **Accept** e **Content-Type**, os componentes principais (HttpMessageConverters, `ContentNegotiationConfigurer`), cenários de restrição, melhores práticas e um **exemplo prático completo**. A configuração “out-of-the-box” do Spring Boot já suporta JSON via Jackson, mas, com as dependências certas (por exemplo, `jackson-dataformat-xml`), podemos facilmente estender para XML. Ao controlar `produces`, `consumes` e, se necessário, parâmetros de query (`format`), garantimos que diferentes clientes acessem a mesma API em seus formatos preferidos sem duplicar lógica ou endpoints.