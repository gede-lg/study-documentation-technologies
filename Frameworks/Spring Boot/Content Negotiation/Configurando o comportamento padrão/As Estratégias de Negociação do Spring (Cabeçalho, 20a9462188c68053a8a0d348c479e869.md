# As Estratégias de Negociação do Spring (Cabeçalho, Parâmetro, Extensão)

---

## 1. Introdução

O **Content Negotiation** (negociação de conteúdo) é o mecanismo que permite ao servidor escolher o **formato de resposta** (por exemplo, JSON, XML, CSV etc.) mais adequado com base nas preferências do cliente. No ecossistema Spring Boot, o Content Negotiation é fundamental para construir APIs RESTful flexíveis, pois garante que uma mesma URL possa retornar diferentes representações (media types) do mesmo recurso sem alterar a lógica de negócio.

Em outras palavras, ao receber uma requisição, o Spring avalia informações como cabeçalhos HTTP (`Accept`), parâmetros de query string (ex: `?format=json`) e extensões de arquivo na URL (ex: `/clientes.json`) para decidir em qual formato serializar o objeto de resposta. A configuração padrão do Spring Boot já fornece um comportamento básico, mas é possível customizar com **estratégias de negociação** (Header, Parameter e Extension) para atender requisitos específicos.

---

## 2. Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conceitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    1. Configuração Global via `WebMvcConfigurer`
    2. Anotações em Controllers (`@RequestMapping`, `@GetMapping` etc.)
    3. Estratégia “Header Based”
    4. Estratégia “Parameter Based”
    5. Estratégia “Extension Based”
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## 3. Conceitos Fundamentais

- **Media Type / MIME Type**: formato de representação de recursos, indicado por strings como `application/json`, `application/xml`, `text/csv` etc.
- **Content Negotiation Manager**: componente do Spring que agrupa várias estratégias para determinar qual `MediaType` usar na resposta.
- **Estratégias de Negociação**: formas pelas quais o Spring decide o media type desejado pelo cliente. As principais são:
    1. **Header-Based**: avalia o cabeçalho `Accept` da requisição.
    2. **Parameter-Based**: examina um parâmetro de query string (por exemplo, `?format=xml`).
    3. **Extension-Based**: usa a extensão da URL (por exemplo, `/produtos.xml`).
    4. (Opcional) **Accept-PathExtension-Mix**: combina as anteriores com prioridade customizada.
- **Configurador Padrão do Spring Boot**: por padrão, o Spring Boot ativa negociações via header (`Accept`) e path extension (desde que não desabilitado). Ainda, a configuração padrão define `application/json` como tipo de retorno preferencial quando nada for especificado.

---

## 4. Sintaxe Detalhada e Uso Prático

### 4.1 Configuração Global via `WebMvcConfigurer`

Para customizar o comportamento padrão de Content Negotiation, implementamos a interface `WebMvcConfigurer` e sobrescrevemos o método `configureContentNegotiation(ContentNegotiationConfigurer configurer)`. Abaixo, um exemplo comentado:

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
            // Deseja incluir extensões de arquivo na URL?
            // Ex: /clientes.json ou /clientes.xml
            .favorPathExtension(true)

            // Nome do parâmetro usado para negociação via query string
            // Ex: /clientes?format=json ou ?mediaType=xml
            .favorParameter(true)
            .parameterName("format")

            // Habilita/desabilita a leitura do cabeçalho Accept
            // Se false, o Accept será ignorado
            .ignoreAcceptHeader(false)

            // Qual o tipo padrão quando nenhuma estratégia retorna resultado?
            .defaultContentType(MediaType.APPLICATION_JSON)

            // Mapeamento de extensão X para media type Y
            .mediaType("json", MediaType.APPLICATION_JSON)
            .mediaType("xml", MediaType.APPLICATION_XML)
            .mediaType("pdf", MediaType.APPLICATION_PDF)
            // Adicione quantos forem necessários
            ;
    }
}

```

**Explicação**:

1. `favorPathExtension(true)`: ativa a estratégia “extension-based”.
2. `favorParameter(true).parameterName("format")`: ativa “parameter-based” usando o parâmetro `format`.
3. `ignoreAcceptHeader(false)`: garante que o valor de `Accept` seja considerado.
4. `defaultContentType(...)`: define `application/json` como fallback.
5. `.mediaType("json", MediaType.APPLICATION_JSON)`: mapeia string `"json"` para `MediaType.APPLICATION_JSON`.

> Observação: Em versões mais recentes do Spring (a partir da 5.2+), recomenda-se cautela ao usar favorPathExtension(true), pois extensões podem causar problemas de segurança ou conflitos em URLs.
> 

---

### 4.2 Anotações em Controllers

Ao criar endpoints REST, usamos anotações como:

```java
@RestController
@RequestMapping("/clientes")
public class ClienteController {

    // Exemplo de endpoint que suporta JSON e XML
    @GetMapping(
        value = "/{id}",
        produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE }
    )
    public Cliente obterCliente(@PathVariable Long id) {
        // busca e retorna objeto Cliente
    }

    // Exemplo de endpoint que consome JSON e XML
    @PostMapping(
        consumes = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE },
        produces = { MediaType.APPLICATION_JSON_VALUE }
    )
    public Cliente criarCliente(@RequestBody Cliente cliente) {
        // salva e retorna cliente
    }
}

```

- **`produces`**: define quais media types o método pode retornar.
- **`consumes`**: define quais media types o método aceita no corpo da requisição.

**Comportamento**: quando o Spring atender `/clientes/1`, ele verificará, em ordem de prioridade (conforme configurado), as informações de path extension (`/clientes/1.json`), de parâmetro (`/clientes/1?format=xml`) e de cabeçalho (`Accept: application/xml`). Se nenhuma delas estiver presente, cairá em `defaultContentType` (`application/json` no exemplo).

---

### 4.3 Estratégia “Header-Based”

- **Como funciona?**: Avalia o cabeçalho HTTP `Accept` enviado pelo cliente.
- **Exemplo de requisição**:
    
    ```
    GET /clientes/1 HTTP/1.1
    Host: api.meusistema.com
    Accept: application/xml
    
    ```
    
    Nesse caso, o Spring deve serializar o objeto como XML.
    
- **Vantagens**:
    - Segue o padrão REST e princípios do HTTP.
    - Mais flexível: vários media types podem ser listados (ex: `Accept: application/json, application/xml;q=0.8`).
- **Código relacionado**:
    - Não exige configuração extra além de não desabilitar `ignoreAcceptHeader`.
    - Se o método `@GetMapping(produces = { ... })` incluir `APPLICATION_XML_VALUE`, o Spring invocará o conversor (Jackson XML ou JAXB etc.) para gerar XML.

---

### 4.4 Estratégia “Parameter-Based”

- **Como funciona?**: O Spring verifica um parâmetro na query string (por padrão, `format`, mas pode ser alterado).
- **Exemplo de requisição**:
    
    ```
    GET /clientes/1?format=json HTTP/1.1
    Host: api.meusistema.com
    
    ```
    
    Aqui, independentemente do cabeçalho `Accept`, o Spring tentará serializar em JSON.
    
- **Vantagens**:
    - Fácil de testar no navegador ou no curl sem precisar configurar cabeçalhos HTTP.
    - Útil quando clientes legados não lidam bem com cabeçalhos.
- **Configuração**:
    
    ```java
    configurer.favorParameter(true).parameterName("format");
    configurer.mediaType("json", MediaType.APPLICATION_JSON);
    configurer.mediaType("xml", MediaType.APPLICATION_XML);
    
    ```
    
- **Comportamento de Precedência**:
    1. Primeiro: verifica `path extension` (se habilitada).
    2. Se não encontrado: verifica parâmetro de query (`?format=`).
    3. Se não encontrado: vê o cabeçalho `Accept`.
    4. Caso nada se aplique: usa `defaultContentType`.

---

### 4.5 Estratégia “Extension-Based”

- **Como funciona?**: Baseia-se na extensão incluída na URL, como `.json` ou `.xml`.
- **Exemplo de requisição**:
    
    ```
    GET /clientes/1.json HTTP/1.1
    Host: api.meusistema.com
    
    ```
    
    O Spring irá detectar `.json`, mapear para `MediaType.APPLICATION_JSON` e gerar JSON.
    
- **Configuração**:
    
    ```java
    configurer.favorPathExtension(true);
    configurer.mediaType("json", MediaType.APPLICATION_JSON);
    configurer.mediaType("xml", MediaType.APPLICATION_XML);
    configurer.ignoreAcceptHeader(true); // caso queira priorizar sempre as extensões
    
    ```
    
- **Observações Importantes**:
    - A partir do Spring 5.x, **`favorPathExtension(true)`** tem implicações de segurança (pode expor vulnerabilidades ou gerar conflito com URLs estáticas).
    - Muitas pessoas desabilitam extensões (`favorPathExtension(false)`) e adotam apenas `header-based` e/ou `parameter-based`.
    - Se for usar extensões, defina explicitamente quais estão permitidas via `.mediaType(...)`.

---

## 5. Cenários de Restrição ou Não Aplicação

1. **API pública com requisitos de segurança rígidos**
    - Evite usar `favorPathExtension(true)`, pois detetores de extensão podem inferir conteúdo indevido ou conflitar com servlets front-end (por exemplo, `.jsp`, `.php`).
2. **Cache em CDN ou proxies**
    - Path extensions podem criar múltiplas versões em cache para a mesma URL base. Se o protocolo CDN não estiver bem configurado, pode servir conteúdo “stale” em formato incorreto.
3. **Clientes legados ou IoT que não enviam cabeçalhos adequadamente**
    - Nesse caso, `parameter-based` pode ser inviável se não houver padronização da query string.
4. **Aplicações em que a resposta será sempre JSON ou sempre XML**
    - Se não há necessidade real de múltiplas representações, desative toda a negociação e fixe o `produces = "application/json"` nos controllers. Isso simplifica e reduz o overhead de análise de cabeçalhos e parâmetros.
5. **Desempenho**
    - Ativar todas as estratégias (path extension + parameter + header) gera lógica adicional a cada requisição. Em sistemas de altíssima carga, avalie o custo/benefício.

---

## 6. Componentes Chave Associados

| Componente | Função/Descrição |
| --- | --- |
| `ContentNegotiationConfigurer` | Classe utilizada no método `configureContentNegotiation(...)` (dentro de `WebMvcConfigurer`) para registrar preferências de negociação. |
| `WebMvcConfigurer` | Interface de configuração MVC do Spring; permite customizar o comportamento padrão do DispatcherServlet (incluindo Content Negotiation). |
| `ContentNegotiationManager` | Gerencia internamente várias estratégias (lista de `ContentNegotiationStrategy`) e determina o `MediaType` final a partir da requisição. |
| `ContentNegotiationStrategy` | Interface que define a estratégia de negociação; possui implementações como: |
| • `HeaderContentNegotiationStrategy` |  |
| • `ParameterContentNegotiationStrategy` |  |
| • `PathExtensionContentNegotiationStrategy`. |  |
| `AbstractMappingMediaTypeFileExtensionResolver` | Responsável por extrair extensão de path (por padrão, sob o prefixo “.”) e converter para `MediaType`. |
| `MediaType` | Classe que representa um media type (ex: `MediaType.APPLICATION_JSON`; pode incluir charset, qualidade etc.). |
| `RequestMappingHandlerAdapter` | Em última instância, invoca conversores de mensagem HTTP (MessageConverters) de acordo com o `MediaType` determinado. |
| `HttpMessageConverter` | Converte objetos em formatos específicos (ex: `MappingJackson2HttpMessageConverter` para JSON; `Jaxb2RootElementHttpMessageConverter` para XML). |

> Fluxo Simplificado:
> 
> 1. Requisição chega ao DispatcherServlet.
> 2. Dispatcher busca `ContentNegotiationManager` e aplica as estratégias registradas (header, parameter, extension) para derivar um `MediaType`.
> 3. Dispatcher escolhe o método do controller (que declare `produces`) compatível com o `MediaType`.
> 4. O `HttpMessageConverter` adequado (JSON, XML etc.) é acionado para serializar o objeto de domínio.

---

## 7. Melhores Práticas e Padrões de Uso

1. **Definir Explicitamente um MediaType Padrão**
    - Sempre inclua `.defaultContentType(...)` para evitar ambiguidades quando a requisição não especifica nada.
    - Ex: `.defaultContentType(MediaType.APPLICATION_JSON)`.
2. **Evitar Path Extensions Quando Possível**
    - Apesar de prático, a estratégia de extensão (ex: `/produtos.json`) pode introduzir vulnerabilidades ou conflitos com arquivos estáticos.
    - Prefira `header-based` ou `parameter-based`.
3. **Segmentar por API Versioning**
    - Para versionamento de API, não use necessariamente extensões (ex: `/v1/produtos.json`).
    - Em vez disso, considere versões em header ou em parte do path: `/v1/produtos` e deixe a negociação apenas no formato do payload (JSON vs. XML).
4. **Manter os `@RequestMapping(produces=...)` Consistentes**
    - Declare no controller apenas os media types que realmente seu endpoint suporta. Isso evita exceções de “406 Not Acceptable” quando o cliente pedir algo não mapeado.
5. **Priorizar a Simplicidade para Clientes RESTful**
    - Cabeçalhos HTTP (`Accept`) são a opção canônica no estilo RESTful.
    - Use `parameter-based` apenas para facilitar testes rápidos (curl/browsers), mas documente claramente na API.
6. **Mapear Apenas Extensões Necessárias**
    - Se precisar usar `favorPathExtension(true)`, restrinja mapeamentos explicitamente:
        
        ```java
        configurer.mediaType("json", MediaType.APPLICATION_JSON);
        configurer.mediaType("xml", MediaType.APPLICATION_XML);
        
        ```
        
    - Não permita que qualquer extensão seja considerada.
7. **Documentar no Swagger/ OpenAPI**
    - Integre ao Swagger para que os consumidores vejam claramente quais formatos são aceitos.
    - Use anotações como `@ApiOperation(produces="application/json")` se usar Springfox ou springdoc-openapi.
8. **Cuidado com Proxies e CDN**
    - Certifique-se de que proxies intermediários não remapeiem cabeçalhos ou adicionem extensões indesejadas.
    - Em arquiteturas distribuídas, padronize a negociação em todos os microserviços.

---

## 8. Exemplo Prático Completo

A seguir, um **projeto simplificado** que demonstra:

1. Configuração de negociação via cabeçalho, parâmetro e extensão.
2. Um endpoint que retorna um objeto `Cliente`.
3. Testes de uso para JSON e XML.

### 8.1 Definição do Modelo de Domínio (`Cliente.java`)

```java
package com.exemplo.negociacao.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;

// Anotação para serialização XML (JAXB)
@XmlRootElement(name = "cliente")
public class Cliente {

    private Long id;
    private String nome;
    private String email;

    public Cliente() { }

    public Cliente(Long id, String nome, String email) {
        this.id = id;
        this.nome = nome;
        this.email = email;
    }

    @XmlElement
    @JsonProperty("id")
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @XmlElement
    @JsonProperty("nome")
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    @XmlElement
    @JsonProperty("email")
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}

```

### 8.2 Controlador REST (`ClienteController.java`)

```java
package com.exemplo.negociacao.controller;

import com.exemplo.negociacao.model.Cliente;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    // Simula busca de cliente no repositório
    private Cliente fetchCliente(Long id) {
        return new Cliente(id, "Fulano da Silva", "fulano@example.com");
    }

    /**
     * Endpoint que suporta JSON e XML.
     *
     * Exemplos de uso:
     * 1) /api/clientes/1                + Header: Accept: application/json  → retorna JSON
     * 2) /api/clientes/1                + Header: Accept: application/xml   → retorna XML
     * 3) /api/clientes/1?format=xml     → retorna XML (independente do Accept)
     * 4) /api/clientes/1.json           → retorna JSON (path extension)
     */
    @GetMapping(
        value = "/{id}",
        produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE }
    )
    public Cliente obterPorId(@PathVariable("id") Long id) {
        return fetchCliente(id);
    }

    /**
     * Endpoint que consome e produz JSON e XML.
     *
     * Exemplo de uso:
     * POST /api/clientes
     * - Header: Content-Type: application/json
     * - Body: { "id": 5, "nome": "Novo Cliente", "email": "novo@example.com" }
     * → retorna JSON do cliente salvo.
     */
    @PostMapping(
        consumes = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE },
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public Cliente criar(@RequestBody Cliente cliente) {
        // Simula persistência e retorno
        cliente.setId(100L);
        return cliente;
    }
}

```

### 8.3 Configuração de Content Negotiation (`WebConfig.java`)

```java
package com.exemplo.negociacao.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * Configura as estratégias de negociação:
     * - path extension
     * - parâmetro "format"
     * - cabeçalho "Accept"
     * - fallback para JSON
     */
    @Override
    public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
        configurer
            // Habilita extensão na URL .json, .xml
            .favorPathExtension(true)

            // Habilita uso de parâmetro ?format=json|xml
            .favorParameter(true)
            .parameterName("format")

            // Considera cabeçalho Accept
            .ignoreAcceptHeader(false)

            // Se nada for especificado, retorna JSON
            .defaultContentType(MediaType.APPLICATION_JSON)

            // Mapeia "json" e "xml"
            .mediaType("json", MediaType.APPLICATION_JSON)
            .mediaType("xml", MediaType.APPLICATION_XML);
    }
}

```

### 8.4 Arquivo de Dependências (`pom.xml`)

```xml
<dependencies>
    <!-- Spring Boot Starter Web inclui Jackson para JSON -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- Jackson Dataformat XML (para serialização/deserialização XML) -->
    <dependency>
        <groupId>com.fasterxml.jackson.dataformat</groupId>
        <artifactId>jackson-dataformat-xml</artifactId>
    </dependency>

    <!-- JAXB API (necessário para anotações @XmlElement, @XmlRootElement) -->
    <dependency>
        <groupId>jakarta.xml.bind</groupId>
        <artifactId>jakarta.xml.bind-api</artifactId>
    </dependency>
    <dependency>
        <groupId>org.glassfish.jaxb</groupId>
        <artifactId>jaxb-runtime</artifactId>
    </dependency>
</dependencies>

```

---

### 8.5 Testando o Exemplo

1. **JSON via Header**
    
    ```bash
    curl -i -H "Accept: application/json" http://localhost:8080/api/clientes/1
    
    ```
    
    - **Resposta** (200 OK, Content-Type: application/json):
        
        ```json
        {
          "id": 1,
          "nome": "Fulano da Silva",
          "email": "fulano@example.com"
        }
        
        ```
        
2. **XML via Header**
    
    ```bash
    curl -i -H "Accept: application/xml" http://localhost:8080/api/clientes/1
    
    ```
    
    - **Resposta** (200 OK, Content-Type: application/xml):
        
        ```xml
        <cliente>
          <id>1</id>
          <nome>Fulano da Silva</nome>
          <email>fulano@example.com</email>
        </cliente>
        
        ```
        
3. **JSON via Query Parameter**
    
    ```bash
    curl -i http://localhost:8080/api/clientes/1?format=json
    
    ```
    
    - Retorna JSON, ignorando o cabeçalho `Accept`.
4. **XML via Query Parameter**
    
    ```bash
    curl -i http://localhost:8080/api/clientes/1?format=xml
    
    ```
    
    - Retorna XML.
5. **JSON via Path Extension**
    
    ```bash
    curl -i http://localhost:8080/api/clientes/1.json
    
    ```
    
    - Retorna JSON.
6. **XML via Path Extension**
    
    ```bash
    curl -i http://localhost:8080/api/clientes/1.xml
    
    ```
    
    - Retorna XML.
7. **Fallback para JSON**
    - Se nenhum parâmetro, extensão ou header `Accept` for enviado, a resposta será sempre em JSON (de acordo com `defaultContentType`).

---

## 9. Sugestões para Aprofundamento

1. **Documentação Oficial do Spring**
    - [Spring Framework – Content Negotiation](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-config-content-negotiation)
    - Explica cada método de `ContentNegotiationConfigurer` e mostra exemplos avançados.
2. **Código-Fonte do Spring**
    - Analisar as implementações de `ContentNegotiationManager` e estratégias em `org.springframework.web.accept.*` para compreender detalhes internos de precedência e parsing.
3. **Artigos e Tutoriais**
    - **“Spring Boot Content Negotiation with JSON and XML”**: demonstrações práticas de configuração e testes.
    - **Blogs de plataformas como Baeldung**: costumam trazer comparativos entre diferentes estratégias (ex: [Baeldung – Guide to Content Negotiation in Spring](https://www.baeldung.com/spring-content-negotiation)).
4. **Casos de Uso Avançados**
    - Implementar **Content Negotiation Customizada** para formatos não convencionais, como CSV, PDF ou mesmo media types próprios (ex: `application/vnd.meuapp.v1+json`).
    - Integrar com **HATEOAS** e gerar respostas com links e metadados no formato preferido.

---

> Resumo Final:
> 
> 
> Neste guia, abordamos desde o conceito de Content Negotiation até sua configuração detalhada em Spring Boot (via `WebMvcConfigurer`), explicamos como usar estratégias baseadas em cabeçalho, parâmetro e extensão, apresentamos os componentes internos mais relevantes e mostramos um exemplo end-to-end com JSON e XML. Por fim, listamos boas práticas para garantir segurança, desempenho e clareza na escolha do tipo de mídia de resposta.
> 

Espero que esta explicação atenda às suas expectativas e forneça uma base sólida para configurar e entender o Content Negotiation no Spring Boot. Qualquer dúvida adicional ou refinamento, estou à disposição!