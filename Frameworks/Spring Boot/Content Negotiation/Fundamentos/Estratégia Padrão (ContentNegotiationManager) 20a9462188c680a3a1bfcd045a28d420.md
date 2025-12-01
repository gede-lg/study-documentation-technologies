# Estratégia Padrão (ContentNegotiationManager)

---

## 1. Introdução

O *Content Negotiation* (negociação de conteúdo) é o mecanismo utilizado por aplicações web para determinar, em tempo de execução, qual formato (JSON, XML, YAML, etc.) será retornado ao cliente. No contexto de aplicações RESTful desenvolvidas com Spring Boot, o **ContentNegotiationManager** é o componente central que orquestra essa decisão, combinando estratégias como cabeçalhos HTTP (`Accept`), extensões de URL (por exemplo, `.json`, `.xml`) e parâmetros de requisição.

Nesta explicação, vamos cobrir:

- O que é *Content Negotiation* e por que é fundamental em APIs RESTful.
- Como o Spring Boot configura por padrão o **ContentNegotiationManager**.
- Quais estratégias ele combina (cabeçalho `Accept`, extensão de caminho, parâmetro de consulta, tipo fixo).
- Como personalizar essas estratégias via código ou `application.properties`.
- Componentes-chave associados (interfaces, classes e anotações).
- Melhores práticas, cenários em que a estratégia padrão pode não ser ideal.
- Um exemplo prático ponta a ponta de uma API que produz JSON e XML dinamicamente.
- Sugestões de aprofundamento.

---

## 2. Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#concepc3a7c3b5es-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    1. [Configuração Padrão no Spring Boot](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#configura%C3%A7%C3%A3o-padr%C3%A3o-no-spring%E2%80%AFboot)
    2. [Exemplos de Endpoints Produzindo Diferentes Formatos](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplos-de-endpoints-produzindo-diferentes-formatos)
    3. [Personalização via `application.properties`](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#personaliza%C3%A7%C3%A3o-via-applicationproperties)
    4. [Personalização por Código (Java)](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#personaliza%C3%A7%C3%A3o-por-c%C3%B3digo-java)
3. [Componentes Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
    1. [ContentNegotiationManager](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#contentnegotiationmanager)
    2. [ContentNegotiationConfigurer](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#contentnegotiationconfigurer)
    3. [ContentNegotiationStrategy e suas Implementações](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#contentnegotiationstrategy-e-suas-implementa%C3%A7%C3%B5es)
    4. [HttpMessageConverters](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#httpmessageconverters)
4. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restric%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## 3. Conceitos Fundamentais

- **O que é Content Negotiation?**
    
    É o processo pelo qual o servidor e o cliente “negociam” o formato de representação dos recursos. Em REST, isso significa que o cliente solicita um recurso (por exemplo, `/api/usuarios/123`) e indica no cabeçalho HTTP `Accept` — ou por extensão na própria URL — qual *media type* prefere (por exemplo, `application/json` ou `application/xml`). O servidor, por sua vez, escolhe a melhor representação disponível e retorna o payload no formato solicitado, assumindo que há um *HttpMessageConverter* configurado para converter o objeto Java para aquele formato.
    
- **Por que é importante?**
    - **Flexibilidade:** Clientes diferentes podem precisar de representações distintas (por exemplo, sistemas legados que só aceitam XML versus aplicações modernas que utilizam JSON).
    - **Compatibilidade:** Permite que a mesma API atenda a diversos tipos de cliente sem duplicação de endpoints.
    - **Escalabilidade:** Futuros formatos (YAML, CSV, Protobuf) podem ser adicionados sem mudar a URI.
- **ContentNegotiationManager no Spring Boot**
    
    O Spring Boot, por meio do auto-configuration do Spring MVC, já cria um **ContentNegotiationManager** pronto para uso, combinando as seguintes estratégias (em ordem de precedência padrão):
    
    1. **Path Extension** – Análise da extensão no caminho da URL (ex.: `/api/usuarios/1.json`).
    2. **Query Parameter** – Parâmetro de consulta (ex.: `/api/usuarios/1?format=xml`).
    3. **Header `Accept`** – Cabeçalho HTTP enviando `Accept: application/json`.
    4. **Fixed Content Type** – Se nenhuma estratégia anterior se aplicar, um tipo fixo pode ser definido (por exemplo, sempre JSON).
    
    Cada estratégia é representada por uma implementação de `ContentNegotiationStrategy`. O **ContentNegotiationManager** reúne todas elas e decide qual utilizar, seguindo a ordem configurada.
    

---

## 4. Sintaxe Detalhada e Uso Prático

### 4.1. Configuração Padrão no Spring Boot

Por padrão, basta ter **Spring Web Starter** no classpath:

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

```

Isso já inclui as bibliotecas necessárias para converter objetos Java em JSON (Jackson) e, opcionalmente, em XML (se a dependência JAXB estiver presente). O **ContentNegotiationManager** criado automaticamente combina:

- `PathExtensionContentNegotiationStrategy`
- `HeaderContentNegotiationStrategy`
- `ParameterContentNegotiationStrategy`
- `FixedContentNegotiationStrategy`

O Spring Boot expõe várias propriedades em `application.properties` (ou `application.yml`) para alterar esse comportamento sem escrever código Java.

### Comportamento padrão

1. Se a URL termina em `.json` ou `.xml`, o tipo será inferido pela extensão (desde que haja conversor registrado).
2. Se existir o parâmetro `?format=...`, e `favorParameter=true` (padrão), a extensão é ignorada em favor do parâmetro.
3. Caso contrário, o Spring olha para o cabeçalho `Accept`.
4. Se nenhuma informação estiver presente, cai no tipo padrão (geralmente `application/json`).

### 4.2. Exemplos de Endpoints Produzindo Diferentes Formatos

Imagine um controlador simples de “Usuário”:

```java
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @GetMapping(
        value = "/{id}",
        produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE }
    )
    public ResponseEntity<UsuarioDto> buscarPorId(@PathVariable Long id) {
        // Simulação de busca do usuário
        UsuarioDto dto = new UsuarioDto(id, "Maria Silva", "maria@example.com");
        return ResponseEntity.ok(dto);
    }
}

```

- Se o cliente requisitar `GET /api/usuarios/1.json`, o Spring retorna JSON (desde que Jackson esteja no classpath).
- Se requisitar `GET /api/usuarios/1.xml`, retorna XML (desde que haja Jackson XML ou JAXB).
- Se enviar `GET /api/usuarios/1` com cabeçalho `Accept: application/json`, retorna JSON.
- Se enviar `GET /api/usuarios/1` com `Accept: application/xml`, retorna XML.

O método `produces = { ... }` informa ao Spring que esse endpoint é capaz de produzir JSON e XML, disponibilizando ambos os *media types*.

> Observação: Se produces não estiver especificado, o Spring tenta inferir a partir dos conversores registrados. Em geral, endpoints retornam JSON por padrão.
> 

### 4.3. Personalização via `application.properties`

Para ajustar a estratégia padrão sem escrever código Java, você pode alterar propriedades no `application.properties`. Alguns parâmetros comumente usados:

```
# 1. Desabilitar a negociação por extensão de caminho (por questões de segurança ou SEO)
spring.mvc.contentnegotiation.favor-path-extension=false

# 2. Habilitar/Desabilitar uso de parâmetro de consulta (ex.: ?format=xml)
spring.mvc.contentnegotiation.favor-parameter=true
spring.mvc.contentnegotiation.parameter-name=format

# 3. Definir mapeamento fixo de extensões
spring.mvc.contentnegotiation.media-types.json=application/json
spring.mvc.contentnegotiation.media-types.xml=application/xml

# 4. Se nenhuma estratégia corresponder, usar sempre um tipo fixo:
spring.mvc.contentnegotiation.default-content-type=application/json

# 5. Desabilitar totalmente a “negociação estendida”:
spring.mvc.contentnegotiation.ignore-unknown-path-extensions=true

```

**Exemplo prático de configuração:**

```
# Desativa path extension (não aceitar .json/.xml na URL)
spring.mvc.contentnegotiation.favor-path-extension=false

# Permitir negociação por parâmetro format. Ex.: ?format=xml ou ?format=json
spring.mvc.contentnegotiation.favor-parameter=true
spring.mvc.contentnegotiation.parameter-name=format

# Mapeia explicitamente extensões a Media Types
spring.mvc.contentnegotiation.media-types.json=application/json
spring.mvc.contentnegotiation.media-types.xml=application/xml

# Define JSON como default quando não houver informação
spring.mvc.contentnegotiation.default-content-type=application/json

```

Com essa configuração, a sequência de verificação do Spring será:

1. Se existir `?format=xml` → XML
2. Se existir `?format=json` → JSON
3. Se o cabeçalho `Accept` estiver presente → usa o cabeçalho
4. Caso contrário → JSON (padrão)

### 4.4. Personalização por Código (Java)

Para casos em que o ajuste via propriedades não é suficiente, pode-se sobrescrever a configuração de *Content Negotiation* através de uma classe de configuração que implemente `WebMvcConfigurer`:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
        configurer
            // Desativa path extension (URL não reconhece .json)
            .favorPathExtension(false)
            // Usa parâmetro "format" na querystring
            .favorParameter(true)
            .parameterName("format")
            // Usa cabeçalho Accept
            .ignoreAcceptHeader(false)
            // Em caso de falha, retorna JSON
            .defaultContentType(MediaType.APPLICATION_JSON)
            // Mapeamento fixo de extensões
            .mediaType("json", MediaType.APPLICATION_JSON)
            .mediaType("xml", MediaType.APPLICATION_XML);
    }
}

```

**Explicação dos métodos:**

- `favorPathExtension(false)`: desliga a estratégia de extensão de arquivo.
- `favorParameter(true)`: habilita a estratégia de parâmetro de query.
- `parameterName("format")`: define o nome do parâmetro de query (padrão é `format`).
- `ignoreAcceptHeader(false)`: considera o cabeçalho `Accept`; se fosse `true`, ignoraria o `Accept`.
- `defaultContentType(...)`: define um tipo fixo quando não há informações explícitas.
- `mediaType(extensão, MediaType)`: mapeia strings de extensão ao respectivo `MediaType`.

---

## 5. Componentes Chave Associados

### 5.1. ContentNegotiationManager

- **Classe:** `org.springframework.web.accept.ContentNegotiationManager`
- **Função:** É o principal orquestrador que agrega várias `ContentNegotiationStrategy` e decide, para cada requisição, qual *MediaType* usar.
- **Como o Spring cria:** A auto-configuração do Spring MVC (ativada pelo `@EnableWebMvc` implícito em aplicações Spring Boot) já registra um bean `ContentNegotiationManager` configurado de acordo com as propriedades em `application.properties` ou pela configuração customizada via `ContentNegotiationConfigurer`.

### 5.2. ContentNegotiationConfigurer

- **Interface:** `org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer`
- **Dónde aparece?** No parâmetro do método `configureContentNegotiation(ContentNegotiationConfigurer configurer)` de `WebMvcConfigurer`.
- **Responsabilidade:** Expõe métodos fluidos para ativar/desativar estratégias de negociação (por extensão, parâmetro etc.), mapear extensões para *MediaTypes* e definir o tipo padrão.

### 5.3. ContentNegotiationStrategy e suas Implementações

Cada estratégia implementa `org.springframework.web.accept.ContentNegotiationStrategy`:

1. **PathExtensionContentNegotiationStrategy**
    - Analisa a extensão do caminho (`.json`, `.xml`).
    - Baseado em `mediaTypeMappings` configurados.
2. **ParameterContentNegotiationStrategy**
    - Lê um parâmetro de query (por padrão `format`), se habilitado.
3. **HeaderContentNegotiationStrategy**
    - Analisa o cabeçalho HTTP `Accept`.
4. **FixedContentNegotiationStrategy**
    - Retorna sempre um *MediaType* fixo, se configurado como default.

O **ContentNegotiationManager** junta instâncias dessas estratégias e, a cada requisição, percorre-as na ordem configurada, retornando o primeiro *MediaType* válido.

### 5.4. HttpMessageConverters

- **Importância:** Após o ContentNegotiationManager definir o *MediaType*, o Spring usa os `HttpMessageConverter`s registrados para serializar o objeto Java nessa representação.
- **Conversores comuns:**
    - `MappingJackson2HttpMessageConverter` – JSON (Jackson).
    - `MappingJackson2XmlHttpMessageConverter` ou `Jaxb2RootElementHttpMessageConverter` – XML.
    - `StringHttpMessageConverter` – texto bruto.
    - `MappingJackson2YamlHttpMessageConverter` (se adicionada dependência) – YAML.
- **Registro automático:** Spring Boot auto-configura conversores para JSON e, se identificar bibliotecas relacionadas a XML (ex.: `jackson-dataformat-xml` ou `jaxb-api`), adiciona conversores XML.

---

## 6. Cenários de Restrição ou Não Aplicação

1. **APIs de alto desempenho, unicamente JSON:**
    - Se todos os clientes consomem JSON e não há necessidade de outro formato, mantê-la simples (sem Content Negotiation) evita sobrecarga de decisão. Basta garantir `produces = MediaType.APPLICATION_JSON_VALUE`.
2. **Sistemas legados forçando uso de extensão de caminho:**
    - Algumas arquiteturas permitem apenas `.json` ou apenas `.xml` em URIs legadas. Nesse caso, pode-se desabilitar negociação por cabeçalho `Accept` e forçar `favorPathExtension`, mas é geralmente desencorajado por SEO e segurança (extensões podem ser exploradas).
3. **URLs virtuosas de APIs sem extensão aparente:**
    - Em sistemas que expõem recursos cujo “.json” final apareceria para o usuário final, é mais elegante usar somente cabeçalhos `Accept` e parâmetros de query, evitando URI “feia”.
4. **Limitado suporte a media types:**
    - Se o cliente for muito restrito (ex.: navegadores antigos, CLIs), nem sempre os cabeçalhos `Accept` são enviados corretamente. Nesse caso, confiar exclusivamente em cabeçalhos pode falhar; usar fallback para formato fixo ou parâmetro é recomendado.

---

## 7. Melhores Práticas e Padrões de Uso

1. **Priorizar Cabeçalho `Accept` sobre Extensões de Caminho**
    - Por padrão, o Spring dá prioridade a **extensão de caminho** se `favorPathExtension=true`. Porém, extensões podem causar problemas de segurança (bibliotecas de template, lookup de arquivos estáticos) e confusão de cache.
    - Recomenda-se:
        
        ```java
        configurer.favorPathExtension(false)
                  .ignoreAcceptHeader(false);
        
        ```
        
    - Assim, evita-se que URLs terminadas em `.json` sejam tratadas como arquivos físicos.
2. **Usar Parâmetro de Query com Cautela**
    - Embora `?format=json` seja conveniente, polui a URL. Se houver múltiplos parâmetros de paginação, filtragem etc., adicionar mais parâmetros torna a leitura difícil.
    - Melhor: confiar no cabeçalho `Accept` ou ter endpoints dedicados, se realmente necessário.
3. **Definir Tipos de Retorno com `produces`**
    - Sempre que possível, anotar cada método com:
        
        ```java
        @GetMapping(
            value = "/{id}",
            produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE }
        )
        
        ```
        
    - Dessa forma, documenta claramente quais formatos o método retorna e o Swagger/OpenAPI (caso configurado) exibirá esses detalhes.
4. **Mapear Explicitamente Extensões a Media Types**
    - No `application.properties`, use:
        
        ```
        spring.mvc.contentnegotiation.media-types.json=application/json
        spring.mvc.contentnegotiation.media-types.xml=application/xml
        
        ```
        
    - Nunca confie em mapeamentos implícitos do Spring, pois podem variar conforme versões.
5. **Configurar Converter XML Separadamente**
    - Se for necessário suportar XML, adicione a dependência:
        
        ```xml
        <dependency>
          <groupId>com.fasterxml.jackson.dataformat</groupId>
          <artifactId>jackson-dataformat-xml</artifactId>
        </dependency>
        
        ```
        
    - E habilite-o explicitamente no `WebMvcConfigurer` (caso queira customizar), por exemplo:
        
        ```java
        @Override
        public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
            Jackson2ObjectMapperBuilder builder = new Jackson2ObjectMapperBuilder();
            builder.createXmlMapper(true);
            converters.add(new MappingJackson2XmlHttpMessageConverter(builder.build()));
        }
        
        ```
        
6. **Evitar “Deep Negotiation” em APIs Simples**
    - Se seu serviço só precisa de JSON, desabilite completamente o `ContentNegotiationManager` para multi-tipos. Simplifica a manutenção e reduz chance de erros.

---

## 8. Exemplo Prático Completo

A seguir, um projeto Spring Boot mínimo que demonstra *Content Negotiation* padrão (JSON × XML). Suponha que usamos Spring Boot 3.x.

### 8.1. Dependências no `pom.xml`

```xml
<project ...>
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.exemplo</groupId>
    <artifactId>negociacao-conteudo</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <properties>
        <java.version>17</java.version>
        <spring.boot.version>3.0.5</spring.boot.version>
    </properties>
    <dependencies>
        <!-- Spring Boot Starter Web: inclui Jackson para JSON -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Jackson Dataformat XML: habilita suporte a XML -->
        <dependency>
            <groupId>com.fasterxml.jackson.dataformat</groupId>
            <artifactId>jackson-dataformat-xml</artifactId>
        </dependency>

        <!-- (Opcional) JAXB API, se preferir usar JAXB puro -->
        <dependency>
            <groupId>jakarta.xml.bind</groupId>
            <artifactId>jakarta.xml.bind-api</artifactId>
        </dependency>

        <!-- Testes JUnit, não detalhado aqui -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>

```

### 8.2. Classe Principal

```java
package com.exemplo.negociacao;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class NegociacaoConteudoApplication {
    public static void main(String[] args) {
        SpringApplication.run(NegociacaoConteudoApplication.class, args);
    }
}

```

### 8.3. DTO `UsuarioDto`

```java
package com.exemplo.negociacao.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;

// Define a raiz do XML como <Usuario>
@JacksonXmlRootElement(localName = "Usuario")
public class UsuarioDto {

    @JsonProperty("id")
    private Long id;

    @JsonProperty("nome")
    private String nome;

    @JsonProperty("email")
    private String email;

    // Construtor sem-args necessário para serialização
    public UsuarioDto() { }

    public UsuarioDto(Long id, String nome, String email) {
        this.id = id;
        this.nome = nome;
        this.email = email;
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
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
}

```

### 8.4. Controlador `UsuarioController`

```java
package com.exemplo.negociacao.controller;

import com.exemplo.negociacao.dto.UsuarioDto;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @GetMapping(
        value = "/{id}",
        produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE }
    )
    public ResponseEntity<UsuarioDto> buscarPorId(@PathVariable Long id) {
        // Exemplo simples de retorno
        UsuarioDto dto = new UsuarioDto(id, "João Souza", "joao.souza@example.com");
        return ResponseEntity.ok(dto);
    }

    @GetMapping(
        produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE }
    )
    public ResponseEntity<List<UsuarioDto>> buscarTodos() {
        // Lista estática apenas para demonstração
        List<UsuarioDto> lista = List.of(
            new UsuarioDto(1L, "João", "joao@example.com"),
            new UsuarioDto(2L, "Maria", "maria@example.com")
        );
        return ResponseEntity.ok(lista);
    }
}

```

### 8.5. Configuração de Content Negotiation (Opcional)

Se quisermos sobrescrever a estratégia padrão, criamos:

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
            // não usar extensão de caminho (.json/.xml)
            .favorPathExtension(false)
            // aceitar parâmetro ?format=xml ou ?format=json
            .favorParameter(true)
            .parameterName("format")
            // usar cabeçalho Accept
            .ignoreAcceptHeader(false)
            // em última instância, sempre JSON
            .defaultContentType(MediaType.APPLICATION_JSON)
            // mapeamentos explícitos
            .mediaType("json", MediaType.APPLICATION_JSON)
            .mediaType("xml", MediaType.APPLICATION_XML);
    }
}

```

### 8.6. Testando a Negociação

1. **Via extensão de caminho** (se `favorPathExtension=true`):
    
    ```
    GET http://localhost:8080/api/usuarios/1.json
    → Content-Type: application/json
    → { "id": 1, "nome": "João Souza", "email": "joao.souza@example.com" }
    
    ```
    
2. **Via parâmetro de query** (se `?format=xml` e `favorParameter=true`):
    
    ```
    GET http://localhost:8080/api/usuarios/1?format=xml
    → Content-Type: application/xml
    → <Usuario><id>1</id><nome>João Souza</nome><email>joao.souza@example.com</email></Usuario>
    
    ```
    
3. **Via cabeçalho `Accept`**:
    - `Accept: application/json` → retorna JSON.
    - `Accept: application/xml` → retorna XML.
4. **Sem informação no caminho, parâmetro ou cabeçalho**:
    - Retorna JSON (tipo padrão configurado).

---

## 9. Cenários de Restrição ou Não Aplicação

1. **APIs Exclusivamente JSON**
    - Se não há necessidade de XML ou outro formato, desabilite negociação multi‐tipo para reduzir complexidade.
    - Nos casos mais simples, basta definir em todos os controladores:
        
        ```java
        @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
        
        ```
        
2. **Aplicações Monolíticas com Views JSP/Thymeleaf**
    - Se a aplicação serve páginas HTML e não expõe APIs REST, a negociação faz menos sentido. Nesses casos, o Spring MVC é usado para renderizar views, e a conversão de objetos em JSON/XML fica restrita a endpoints REST específicos.
3. **Clients que Não Enviam Cabeçalhos `Accept`**
    - Alguns clientes legados (ex.: dispositivos IoT ou navegadores muito antigos) podem enviar cabeçalhos genéricos ou ausentes. Nessa situação, adotar parâmetro de query ou aceitar apenas um formato fixo é mais seguro.
4. **URLs com SEO e Extensões Naturais**
    - Sites públicos que expõem conteúdos estáticos (ex.: `/pagina.html`) podem ser confundidos se `.html`, `.json`, `.xml` estiverem habilitados para content negotiation. É comum desativar `favorPathExtension` nesses casos.

---

## 10. Melhores Práticas e Padrões de Uso

1. **Evitar Path Extension (por segurança e SEO)**
    
    ```java
    configurer.favorPathExtension(false);
    
    ```
    
    - Extensões podem expor detalhes de implementação.
    - Ataques podem explorar a enumeração de arquivos estáticos.
2. **Confiar no Cabeçalho `Accept` como Fonte Principal**
    
    ```java
    configurer.ignoreAcceptHeader(false);
    
    ```
    
    - Mantém URLs “limpas” (sem `.json` ou parâmetros extras).
    - A maioria dos clientes HTTP modernos define `Accept` corretamente.
3. **Definir Tipos de Resposta Explícitos com `produces`**
    
    ```java
    @GetMapping(value = "/recurso", produces = { "application/json", "application/xml" })
    
    ```
    
    - Garante que a documentação gerada (Swagger/OpenAPI) mostre corretamente os formatos suportados.
    - Bloqueia solicitações para formatos não suportados (retorna 406 Not Acceptable).
4. **Mapear Explicitamente Extensões em `application.properties`**
    
    ```
    spring.mvc.contentnegotiation.media-types.json=application/json
    spring.mvc.contentnegotiation.media-types.xml=application/xml
    
    ```
    
    - Evita depender de mapeamentos “mágicos” do framework.
5. **Validar Priority Order e Resolução de Conflitos**
    - Se dois métodos puderem corresponder ao mesmo recurso para formatos diferentes (ex.: `/api/usuarios/1.json` e `/api/usuarios/1.xml`), é importante que o `produces` e a ordem de estratégias estejam coerentes, para não causar ambiguidade.
6. **Testar Todos os Cenários de Negotiation**
    - Automatize testes integrados para garantir que, quando o cliente enviar `Accept: application/xml`, o JSON não seja retornado por engano.
    - Utilize o **MockMvc** do Spring para simular requisições com diferentes cabeçalhos e parâmetros:
        
        ```java
        mockMvc.perform(get("/api/usuarios/1")
                .accept(MediaType.APPLICATION_XML))
            .andExpect(status().isOk())
            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_XML))
            .andExpect(xpath("/Usuario/nome").string("João Souza"));
        
        ```
        

---

## 11. Exemplo Prático Completo

A seguir, um cenário consolidado que demonstra uma API RESTful capaz de negociar JSON e XML, com configuração de content negotiation e testes automatizados.

### 11.1. Estrutura de Pacotes

```
src/
└─ main/
   ├─ java/
   │  └─ com.exemplo.negociacao/
   │     ├─ NegociacaoConteudoApplication.java
   │     ├─ config/
   │     │  └─ WebConfig.java
   │     ├─ controller/
   │     │  └─ UsuarioController.java
   │     └─ dto/
   │        └─ UsuarioDto.java
   └─ resources/
      └─ application.properties

```

### 11.2. Arquivos Detalhados

### `application.properties`

```
# Desabilitanegociação por extensão (nada de /usuario/1.json)
spring.mvc.contentnegotiation.favor-path-extension=false

# Habilita negociação por parâmetro de query: ?format=xml ou ?format=json
spring.mvc.contentnegotiation.favor-parameter=true
spring.mvc.contentnegotiation.parameter-name=format

# Mapeamentos explícitos (extensões → media types)
spring.mvc.contentnegotiation.media-types.json=application/json
spring.mvc.contentnegotiation.media-types.xml=application/xml

# Conteúdo padrão ao não especificar
spring.mvc.contentnegotiation.default-content-type=application/json

```

### `WebConfig.java`

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
            // desativa .json/.xml na URL
            .favorPathExtension(false)
            // permite ?format=xml ou ?format=json
            .favorParameter(true)
            .parameterName("format")
            // considera cabeçalho Accept
            .ignoreAcceptHeader(false)
            // caso não haja indicação, retorna JSON
            .defaultContentType(MediaType.APPLICATION_JSON)
            // mapeamento explicito de extensões
            .mediaType("json", MediaType.APPLICATION_JSON)
            .mediaType("xml", MediaType.APPLICATION_XML);
    }
}

```

### `UsuarioDto.java`

```java
package com.exemplo.negociacao.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;

// Marca o DTO como raiz do XML <Usuario>
@JacksonXmlRootElement(localName = "Usuario")
public class UsuarioDto {

    @JsonProperty("id")
    private Long id;

    @JsonProperty("nome")
    private String nome;

    @JsonProperty("email")
    private String email;

    public UsuarioDto() { }

    public UsuarioDto(Long id, String nome, String email) {
        this.id = id;
        this.nome = nome;
        this.email = email;
    }

    // getters e setters omitidos para brevidade
}

```

### `UsuarioController.java`

```java
package com.exemplo.negociacao.controller;

import com.exemplo.negociacao.dto.UsuarioDto;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @GetMapping(
        value = "/{id}",
        produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE }
    )
    public ResponseEntity<UsuarioDto> buscarPorId(@PathVariable Long id) {
        UsuarioDto dto = new UsuarioDto(id, "Carlos Pereira", "carlos.pereira@example.com");
        return ResponseEntity.ok(dto);
    }

    @GetMapping(
        produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE }
    )
    public ResponseEntity<List<UsuarioDto>> buscarTodos() {
        List<UsuarioDto> lista = List.of(
            new UsuarioDto(1L, "Alice", "alice@example.com"),
            new UsuarioDto(2L, "Rafael", "rafael@example.com")
        );
        return ResponseEntity.ok(lista);
    }
}

```

### 11.3. Testes Automatizados (MockMvc)

```java
package com.exemplo.negociacao;

import com.exemplo.negociacao.controller.UsuarioController;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UsuarioController.class)
class UsuarioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void quandoAcceptJson_deveRetornarJson() throws Exception {
        mockMvc.perform(get("/api/usuarios/1")
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.nome").value("Carlos Pereira"));
    }

    @Test
    void quandoAcceptXml_deveRetornarXml() throws Exception {
        mockMvc.perform(get("/api/usuarios/1")
                .accept(MediaType.APPLICATION_XML))
            .andExpect(status().isOk())
            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_XML))
            .andExpect(xpath("/Usuario/nome").string("Carlos Pereira"));
    }

    @Test
    void quandoQueryParamFormatXml_deveRetornarXml() throws Exception {
        mockMvc.perform(get("/api/usuarios/1?format=xml"))
            .andExpect(status().isOk())
            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_XML))
            .andExpect(xpath("/Usuario/email").string("carlos.pereira@example.com"));
    }

    @Test
    void quandoSemEspecificacao_deveRetornarJsonComoDefault() throws Exception {
        mockMvc.perform(get("/api/usuarios/1"))
            .andExpect(status().isOk())
            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }
}

```

**Fluxo de execução em cada requisição:**

1. `MockMvc` faz `GET /api/usuarios/1` com cabeçalho ou parâmetro.
2. O **ContentNegotiationManager**, configurado por `WebConfig`, avalia:
    - Existe `?format`? Se sim, escolhe esse tipo.
    - Senão, verifica o cabeçalho `Accept`.
    - Senão, retorna o tipo padrão (`application/json`).
3. Com o *MediaType* definido, o Spring seleciona o `HttpMessageConverter` apropriado (JSON ou XML).
4. Serializa o objeto `UsuarioDto` e retorna a resposta.

---

## 12. Sugestões para Aprofundamento

1. **Documentação Oficial Spring – Content Negotiation**
    - Leia atentamente a seção “Content Negotiation” na referência do Spring Web:
        
        [https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-config-content-negotiation](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-config-content-negotiation)
        
2. **Habilitando Outros Formatos**
    - Explore conversores para **YAML**, **CSV** e até **Protobuf**. Cada formato exige registrar um `HttpMessageConverter` específico.
3. **Negociação Avançada**
    - Implemente uma estratégia customizada estendendo `ContentNegotiationStrategy` para, por exemplo, suportar cookies ou subdomínios (`api.example.com/json/`).
4. **Integração com OpenAPI/Swagger**
    - Utilize `springdoc-openapi` para gerar documentação que leve em conta os *produces* de cada método de controller e exiba exemplos interativos (JSON/XML).
5. **Testes de Contrato (Contract Testing)**
    - Ferramentas como **Spring Cloud Contract** e **Pact** podem validar que a API sempre retorna o formato esperado para cada *media type*.
6. **Benchmarking e Performance**
    - Em cenários de grande volume, avalie o custo de manter múltiplos conversores (JSON/XML) em memória. Desabilite formatos menos usados.
7. **Segurança e CORS**
    - Se sua API for acessada por navegadores, valide políticas CORS ao retornar diferentes *media types* (alguns navegadores podem impedir certos tipos).

---

> Resumo Final:
> 
> 
> O **ContentNegotiationManager** do Spring Boot fornece uma abordagem flexível para atender a múltiplos formatos de resposta em uma mesma URI. A configuração padrão já atende muitos cenários, mas você pode ajustar-la via propriedades ou por código Java, priorizando cabeçalhos `Accept` e desativando extensões de caminho para manter URLs limpas e seguras.
> 

Com este guia, você tem uma visão completa — do conceito teórico à implementação prática — sobre como a estratégia padrão de *Content Negotiation* funciona e como adaptá-la conforme as necessidades de sua aplicação Spring Boot.