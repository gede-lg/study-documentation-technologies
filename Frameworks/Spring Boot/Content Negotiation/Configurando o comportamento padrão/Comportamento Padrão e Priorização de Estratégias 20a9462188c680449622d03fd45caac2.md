# Comportamento Padrão e Priorização de Estratégias

---

## Introdução

O *Content Negotiation* (ou “negociação de conteúdo”) é o mecanismo pelo qual uma aplicação web determina o melhor formato para representar a resposta (por exemplo, JSON, XML, HTML) em função das preferências do cliente. No contexto do Spring Boot, isso envolve configurar tanto comportamentos padrão quanto a ordem de precedência entre diferentes estratégias (parâmetro de query, extensão de caminho, cabeçalho HTTP, entre outros).

Nesta explicação, abordaremos desde conceitos fundamentais até exemplos práticos de configuração, cobrindo tanto uma visão geral concisa quanto detalhes completos, conforme solicitado.

---

## Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conceitos-fundamentais)
2. [Comportamento Padrão no Spring Boot](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#comportamento-padr%C3%A3o-no-springboot)
3. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    1. [Configuração via `WebMvcConfigurer`](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#configura%C3%A7%C3%A3o-via-webmvcconfigurer)
    2. [Propriedades no `application.properties` / `application.yml`](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#propriedades-no-applicationproperties--applicationyml)
    3. [Anotação `@RequestMapping` e `produces`](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#anota%C3%A7%C3%A3o-requestmapping-e-produces)
4. [Priorização de Estratégias](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#prioriza%C3%A7%C3%A3o-de-estrat%C3%A9gias)
    1. [Extensão de Caminho (Path Extension)](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#extens%C3%A3o-de-caminho-path-extension)
    2. [Parâmetro de Query (Request Parameter)](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#par%C3%A2metro-de-query-request-parameter)
    3. [Cabeçalho `Accept`](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cabe%C3%A7alho-accept)
    4. [Default Content Type](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#default-content-type)
5. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
6. [Componentes Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
7. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
8. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
9. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## 1. Conceitos Fundamentais

- **Definição**: Content Negotiation é o processo de decisão sobre qual formato de resposta (MIME Type) retornar ao cliente, levando em conta as preferências informadas (por cabeçalho `Accept`, extensão de URL, parâmetros, etc.) e as capacidades do servidor.
- **Propósito**: Garantir que o cliente receba a representação adequada (por exemplo, JSON ou XML), melhorando interoperabilidade e flexibilidade da API.
- **Importância no Spring Boot**: O Spring, por padrão, já oferece suporte a Content Negotiation via `HttpMessageConverter`, mas muitas vezes é necessário ajustar prioridades para:
    1. Desativar extensões de caminho (em razão de vulnerabilidades de segurança ou obsolescência).
    2. Habilitar uso de parâmetro de query (`format=json`).
    3. Definir um *default content type* caso o cliente não especifique preferência.

---

## 2. Comportamento Padrão no Spring Boot

- **Mensagens HTTP**: O Spring Boot, ao detectar dependências como Jackson (para JSON) e JAXB (para XML), registra automaticamente conversores (`HttpMessageConverter`) para suportar JSON e XML.
- **Estratégias por Omissão**:
    1. Leitura do cabeçalho `Accept`: o Spring olha primeiro para `Accept`.
    2. Em versões anteriores, extensões de caminho (por exemplo, `/recurso.json`) eram usadas, mas, a partir do Spring Boot 2.6+, isso vem desativado (para evitar exploração de vulnerabilidades associadas a “path extension”)—padrão pode variar conforme a versão.
    3. Se nenhuma indicação explícita for encontrada, retorna-se um *default content type* (geralmente JSON) ou lança-se `406 Not Acceptable`.
- **Configuração Automática**: O Spring Boot aplica configurações sensatas por padrão, mas para ajustar comportamentos específicos (por exemplo, desabilitar ou habilitar estratégias), é necessário criar uma configuração customizada.

---

## 3. Sintaxe Detalhada e Uso Prático

### 3.1 Configuração via `WebMvcConfigurer`

Para personalizar conteúdo negociado, implementa-se a interface `WebMvcConfigurer` e sobrescreve-se o método `configureContentNegotiation(ContentNegotiationConfigurer configurer)`.

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.http.MediaType;

@Configuration
public class ContentNegotiationConfig implements WebMvcConfigurer {

    @Override
    public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
        // 1. Definir se usar extensão de caminho: false => desativa
        configurer.favorPathExtension(false);

        // 2. Habilitar parâmetro de query: ex. ?format=json
        configurer.favorParameter(true)
                  .parameterName("format");

        // 3. Ignorar cabeçalho 'Accept' se desejado (não comum)
        // configurer.ignoreAcceptHeader(true);

        // 4. Definir tipo padrão, se nenhuma estratégia corresponder
        configurer.defaultContentType(MediaType.APPLICATION_JSON);

        // 5. Mapear valores de parâmetro para tipos: "json" => application/json, "xml" => application/xml
        configurer.mediaType("json", MediaType.APPLICATION_JSON);
        configurer.mediaType("xml", MediaType.APPLICATION_XML);
    }
}

```

**Explicação das configurações principais**:

1. `favorPathExtension(boolean)`: controla se o Spring deve considerar a extensão de caminho (ex.: `/pessoa.json`).
2. `favorParameter(boolean)`: habilita uso de parâmetro de query (ex.: `?format=xml`).
    - `parameterName(String)`: define o nome do parâmetro (padrão: `"format"`).
3. `ignoreAcceptHeader(boolean)`: se `true`, ignora totalmente o cabeçalho `Accept`.
4. `defaultContentType(MediaType)`: tipo padrão retornado quando nenhuma estratégia específica é encontrada.
5. `mediaType(String, MediaType)`: mapeia valores literais (como `"json"`) para tipos MIME (como `application/json`).

---

### 3.2 Propriedades no `application.properties` / `application.yml`

O Spring Boot também expõe propriedades para ajustes mínimos. Exemplo em `application.properties`:

```
# Desativa a estratégia de extensão de caminho
spring.mvc.contentnegotiation.favor-path-extension=false

# Habilita estratégia de parâmetro de query e define o nome
spring.mvc.contentnegotiation.favor-parameter=true
spring.mvc.contentnegotiation.parameter-name=format

# Define o tipo padrão (application/json)
spring.mvc.contentnegotiation.default-content-type=application/json

# Mapeia valores literais para tipos
spring.mvc.contentnegotiation.media-types.json=application/json
spring.mvc.contentnegotiation.media-types.xml=application/xml

```

Ou em `application.yml`:

```yaml
spring:
  mvc:
    contentnegotiation:
      favor-path-extension: false
      favor-parameter: true
      parameter-name: format
      default-content-type: application/json
      media-types:
        json: application/json
        xml: application/xml

```

> Observação: propriedades têm menor precedência que configurações em Java via WebMvcConfigurer. Se houver conflito, a configuração Java prevalece.
> 

---

### 3.3 Anotação `@RequestMapping` e `produces`

Além da configuração global, cada controlador pode definir que formatos produz por meio do atributo `produces`:

```java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.MediaType;

@RestController
public class PessoaController {

    // Retorna JSON ou XML conforme Content Negotiation global
    @GetMapping(value = "/pessoas", produces = {
            MediaType.APPLICATION_JSON_VALUE,
            MediaType.APPLICATION_XML_VALUE })
    public List<Pessoa> listarPessoas() {
        // ...
    }
}

```

- O Spring verifica o cabeçalho `Accept` (ou parâmetros/extensões) para decidir se serializa como JSON ou XML.
- Se o cliente pedir `Accept: application/xml`, a resposta virá em XML (desde que haja converter apropriado, como Jackson XML ou JAXB).

---

## 4. Priorização de Estratégias

O Spring Framework aplica as estratégias de Content Negotiation na seguinte ordem (conforme configuração padrão ou customizada):

1. **Extensão de Caminho (Path Extension)**
    - Exemplo: `/api/cliente.json` → sinaliza que o cliente espera `application/json`.
    - **Configuração:**
        
        ```java
        configurer.favorPathExtension(true)
                  .ignoreUnknownPathExtensions(false);
        configurer.mediaType("json", MediaType.APPLICATION_JSON);
        configurer.mediaType("xml", MediaType.APPLICATION_XML);
        
        ```
        
    - **Observação:** geralmente desabilitado por questões de segurança (injeção de extensões e ataques de MIME type).
2. **Parâmetro de Query (Request Parameter)**
    - Exemplo: `/api/cliente?format=xml` → sinaliza `application/xml`.
    - **Configuração:**
        
        ```java
        configurer.favorParameter(true)
                  .parameterName("format");
        configurer.mediaType("json", MediaType.APPLICATION_JSON);
        configurer.mediaType("xml", MediaType.APPLICATION_XML);
        
        ```
        
    - Útil quando se quer que o cliente especifique o formato pela URL, sem alterar cabeçalhos.
3. **Cabeçalho `Accept`**
    - Exemplo: `Accept: application/json` ou `Accept: application/xml`.
    - **Configuração Padrão:** o Spring observa o cabeçalho e seleciona o conversor adequado.
    - Pode-se fazer `ignoreAcceptHeader(true)` para forçar uso de parâmetro/extensão em vez do cabeçalho.
4. **Default Content Type**
    - Se nenhuma das anteriores corresponder (por exemplo, sem extensão, sem parâmetro e sem cabeçalho `Accept`), o Spring usa o tipo definido em `defaultContentType` (geralmente `application/json`).
    - Sem esse default, o servidor pode retornar `406 Not Acceptable`.

> Fluxo de decisão:
> 
> 1. Checa extensão de caminho (se habilitada).
> 2. Checa parâmetro de query (se habilitado).
> 3. Checa cabeçalho `Accept` (se não ignorado).
> 4. Usa `defaultContentType` (se configurado).
> 5. Caso nada corresponda, retorna `406 Not Acceptable`.

---

## 5. Cenários de Restrição ou Não Aplicação

- **APIs restritas a um único formato (somente JSON)**
    - Se não há necessidade de múltiplos formatos, pode-se simplesmente forçar JSON e desativar todas as outras estratégias:
        
        ```java
        configurer.favorPathExtension(false)
                  .favorParameter(false)
                  .ignoreAcceptHeader(true)
                  .defaultContentType(MediaType.APPLICATION_JSON);
        
        ```
        
    - Assim, qualquer requisição retorna JSON, evitando overhead de negociação.
- **Extensão de caminho habilitada mas com potenciais conflitos**
    - Ao usar extesões (por exemplo, `/recurso.jpg`), cuidado para que nomes de recurso não sejam interpretados como tipo de mídia.
    - Quando a URI naturalmente contém “.algumacoisa”, pode haver má identificação.
- **Clientes que não suportam `Accept` ou parâmetros de query**
    - Em casos de clientes legados, talvez seja necessário priorizar extensão de caminho.
    - Contudo, o uso de extensão de caminho é desencorajado em aplicações modernas.
- **APIs que retornam múltiplos formatos mas exigem header customizado**
    - Se quiser negociar usando um header próprio (ex.: `X-Format: xml`), seria preciso estender `ContentNegotiationStrategy`:
        
        ```java
        import org.springframework.web.accept.HeaderContentNegotiationStrategy;
        import org.springframework.web.accept.ContentNegotiationStrategy;
        
        // Exemplo de customização em configureContentNegotiation:
        List<ContentNegotiationStrategy> strategies = new ArrayList<>();
        strategies.add(new MyCustomHeaderStrategy("X-Format"));
        strategies.add(new HeaderContentNegotiationStrategy());
        configurer.strategies(strategies);
        
        ```
        
    - Esses cenários são avançados e fogem do uso padrão.

---

## 6. Componentes Chave Associados

1. **`ContentNegotiationConfigurer` (classe)**
    - Ponto de entrada para definir comportamento global de Content Negotiation.
    - Métodos principais:
        - `favorPathExtension(boolean)`
        - `favorParameter(boolean)`
        - `parameterName(String)`
        - `ignoreAcceptHeader(boolean)`
        - `defaultContentType(MediaType…)`
        - `mediaType(String, MediaType)`
        - `strategies(List<ContentNegotiationStrategy>)`
2. **`WebMvcConfigurer` (interface)**
    - Permite sobrescrever métodos de configuração MVC, como `configureContentNegotiation(...)`.
    - Outras formas de ajuste: `extendMessageConverters(...)`, para registrar conversores customizados.
3. **`HttpMessageConverter` (interface)**
    - Responsável por serializar/ desserializar objetos Java para diferentes formatos (JSON, XML, etc.).
    - Exemplos comuns:
        - `MappingJackson2HttpMessageConverter` (JSON via Jackson)
        - `Jaxb2RootElementHttpMessageConverter` (XML via JAXB)
4. **`ContentNegotiationStrategy` (interface)**
    - Estratégias específicas que decidem o tipo de mídia.
    - Implementações típicas:
        - `PathExtensionContentNegotiationStrategy`
        - `ParameterContentNegotiationStrategy`
        - `HeaderContentNegotiationStrategy`
        - `FixedContentNegotiationStrategy` (força sempre um tipo fixo)
5. **Anotações em Controladores**
    - `@RequestMapping(produces = ...)` ou, de forma mais específica, `@GetMapping(produces = ...)`: limita os tipos que aquele endpoint pode produzir.
    - `@RequestMapping(consumes = ...)`: análogo para o corpo da requisição.
6. **Propriedades de Configuração (`spring.mvc.contentnegotiation.*`)**
    - Expostas no `application.properties` ou `application.yml` para ajustes sem necessidade de código Java.

---

## 7. Melhores Práticas e Padrões de Uso

1. **Desativar extensões de caminho sempre que possível**
    - Extensões de caminho podem gerar conflitos e riscos de segurança.
    - Use `favorPathExtension(false)`.
2. **Definir um tipo padrão claro**
    - Configure `defaultContentType(MediaType.APPLICATION_JSON)` para evitar retornos inesperados de `406`.
3. **Habilitar parâmetro de query para fins de teste ou casos específicos**
    - Útil em desenvolvimento: `/api/entidade?format=xml`.
    - Porém, em produção, prefira confiar no cabeçalho `Accept`.
4. **Evitar ignorar completamente o cabeçalho `Accept`**
    - Cabeçalho `Accept` é o mecanismo HTTP padrão para negociação de conteúdo; desativá-lo pode comprometer interoperabilidade com clientes que o utilizam corretamente.
5. **Documentar claramente os formatos suportados**
    - Na documentação da API (Swagger/OpenAPI), especificar claramente quais formatos estão disponíveis e como negociá-los (`produces` e `consumes`).
6. **Manter consistência nos nomes de parâmetros**
    - Se optar pelo parâmetro `format`, use-o de forma padronizada em toda a API.
7. **Testar todos os cenários de negociação**
    - Teste endpoints com:
        - Sem cabeçalho `Accept` (deve retornar default).
        - Com `Accept: application/json`.
        - Com `Accept: application/xml`.
        - Com parâmetro `?format=xml`.
        - Com extensão de caminho (se habilitada).
8. **Utilizar conversores customizados apenas quando necessário**
    - Se precisar de serialização específica (por exemplo, CSV), registre um `HttpMessageConverter` customizado.

---

## 8. Exemplo Prático Completo

Neste exemplo, criaremos uma API simples de “Produto” que retorna informações tanto em JSON quanto em XML, configurando:

1. Desativação de extensão de caminho.
2. Habilitação de parâmetro de query `format`.
3. Priorização: parâmetro de query > cabeçalho `Accept` > default JSON.

### 8.1 Estrutura do Projeto (resumida)

```
src/main/java
├── com.example.demo
│   ├── DemoApplication.java
│   ├── config
│   │   └── ContentNegotiationConfig.java
│   └── controller
│       └── ProdutoController.java
└── resources
    └── application.yml

```

### 8.2 `DemoApplication.java`

```java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}

```

### 8.3 `ContentNegotiationConfig.java`

```java
package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.http.MediaType;

@Configuration
public class ContentNegotiationConfig implements WebMvcConfigurer {

    @Override
    public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
        // 1. Desativa extensão de caminho (ex.: /produto.json não será considerado)
        configurer.favorPathExtension(false);

        // 2. Habilita parâmetro de query: ?format=json ou ?format=xml
        configurer.favorParameter(true)
                  .parameterName("format");

        // 3. Define cabeçalho 'Accept' como estratégia secundária (default)
        configurer.ignoreAcceptHeader(false);

        // 4. Define tipo padrão quando não houver indicação: JSON
        configurer.defaultContentType(MediaType.APPLICATION_JSON);

        // 5. Mapeia valores do parâmetro para media types
        configurer.mediaType("json", MediaType.APPLICATION_JSON);
        configurer.mediaType("xml", MediaType.APPLICATION_XML);
    }
}

```

### 8.4 `application.yml`

```yaml
spring:
  mvc:
    contentnegotiation:
      favor-path-extension: false
      favor-parameter: true
      parameter-name: format
      default-content-type: application/json
      media-types:
        json: application/json
        xml: application/xml

```

> Nota: As propriedades servem apenas se não houver configuração via WebMvcConfigurer. Aqui, mostramos ambos para referência.
> 

### 8.5 Modelo de Domínio `Produto.java`

```java
package com.example.demo.model;

import javax.xml.bind.annotation.XmlRootElement;

// Anotação opcional para permitir JAXB gerar XML
@XmlRootElement(name = "produto")
public class Produto {
    private Long id;
    private String nome;
    private Double preco;

    // Construtores
    public Produto() {}
    public Produto(Long id, String nome, Double preco) {
        this.id = id;
        this.nome = nome;
        this.preco = preco;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public Double getPreco() { return preco; }
    public void setPreco(Double preco) { this.preco = preco; }
}

```

### 8.6 Controlador `ProdutoController.java`

```java
package com.example.demo.controller;

import com.example.demo.model.Produto;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
public class ProdutoController {

    /**
     * Endpoint que produz JSON e XML, conforme Content Negotiation:
     * - Se ?format=xml, retorna XML
     * - Se Accept: application/xml, retorna XML
     * - Caso contrário, retorna JSON
     */
    @GetMapping(
        value = "/produtos",
        produces = {
            MediaType.APPLICATION_JSON_VALUE,
            MediaType.APPLICATION_XML_VALUE
        }
    )
    public List<Produto> listar() {
        return Arrays.asList(
                new Produto(1L, "Notebook", 3500.00),
                new Produto(2L, "Mouse", 80.00),
                new Produto(3L, "Teclado Mecânico", 450.00)
        );
    }
}

```

### 8.7 Testando o Comportamento

1. **Sem qualquer indicação (nenhum cabeçalho e sem parâmetro)**
    - Requisição:
        
        ```
        GET /produtos HTTP/1.1
        Host: localhost:8080
        
        ```
        
    - **Resultado:**
        - Será aplicado `defaultContentType = application/json`.
        - Corpo da resposta (JSON):
            
            ```json
            [
              {"id":1,"nome":"Notebook","preco":3500.0},
              {"id":2,"nome":"Mouse","preco":80.0},
              {"id":3,"nome":"Teclado Mecânico","preco":450.0}
            ]
            
            ```
            
2. **Com parâmetro de query `?format=xml`**
    - Requisição:
        
        ```
        GET /produtos?format=xml HTTP/1.1
        Host: localhost:8080
        
        ```
        
    - **Resultado:**
        - O Spring identifica `format=xml` e aplica `MediaType.APPLICATION_XML`.
        - Corpo da resposta em XML (via JAXB):
            
            ```xml
            <List>
              <produto>
                <id>1</id>
                <nome>Notebook</nome>
                <preco>3500.0</preco>
              </produto>
              <produto>
                <id>2</id>
                <nome>Mouse</nome>
                <preco>80.0</preco>
              </produto>
              <produto>
                <id>3</id>
                <nome>Teclado Mecânico</nome>
                <preco>450.0</preco>
              </produto>
            </List>
            
            ```
            
3. **Com cabeçalho `Accept: application/xml`**
    - Requisição:
        
        ```
        GET /produtos HTTP/1.1
        Host: localhost:8080
        Accept: application/xml
        
        ```
        
    - **Resultado:**
        - Spring observa o cabeçalho `Accept` e escolhe XML (caso `format` não esteja presente).
        - Mesma resposta XML do exemplo anterior.
4. **Com cabeçalho `Accept: text/html`**
    - Requisição:
        
        ```
        GET /produtos HTTP/1.1
        Host: localhost:8080
        Accept: text/html
        
        ```
        
    - **Resultado:**
        - Nem `format` (ausente) nem `Accept: text/html` (não suportado) correspondem.
        - Aplica `defaultContentType = application/json`.
        - Retorna JSON normalmente.
5. **Com extensão de caminho `/produtos.xml`**
    - Requisição:
        
        ```
        GET /produtos.xml HTTP/1.1
        Host: localhost:8080
        
        ```
        
    - **Resultado:**
        - Como `favorPathExtension = false`, o Spring ignora a extensão.
        - Trata a URI como `/produtos.xml` ao invés de `/produtos`.
        - Se não existir mapeamento para `/produtos.xml`, retorna `404 Not Found`.

---

## 9. Sugestões para Aprofundamento

- Documentação oficial do Spring (versão correspondente ao seu projeto):
    - [Spring Framework – Content Negotiation](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-config-content-negotiation)
    - [Spring Boot – Commons Auto-Configuration](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#features.web.spring-mvc.auto-configuration)
- Livro “Spring in Action” (Capítulo sobre REST e Content Negotiation)
- Artigos práticos sobre segurança em Content Negotiation (evitando uso inseguro de “path extension”)
- Tutoriais sobre `HttpMessageConverter` customizados (CSV, YAML, etc.)

---

> Resumo Final:
> 
> 1. O Spring Boot já disponibiliza conversores para JSON/XML automaticamente, mas é fundamental ajustar prioridades: desative extensões de caminho, habilite parâmetros de query se necessário, e defina um tipo padrão.
> 2. A configuração pode ser feita via `WebMvcConfigurer` em Java ou por propriedades no `application.yml`.
> 3. Existem três estratégias principais—extensão, parâmetro e cabeçalho `Accept`—seguindo uma ordem de precedência configurável pelo desenvolvedor.
> 4. Em cenários onde se quer apenas um formato, simplifique: ignore todos menos o JSON (ou o formato desejado), reduzindo complexidade.
> 5. Teste exaustivamente com diferentes requisições para garantir que a negociação de conteúdo está ocorrendo conforme o esperado.
> 6. Utilize anotações `@RequestMapping(produces = ...)` para declarar explicitamente formatos suportados por cada endpoint.

Com isso, você deve ter um entendimento completo de como configurar e priorizar estratégias de Content Negotiation em aplicações Spring Boot com Java.