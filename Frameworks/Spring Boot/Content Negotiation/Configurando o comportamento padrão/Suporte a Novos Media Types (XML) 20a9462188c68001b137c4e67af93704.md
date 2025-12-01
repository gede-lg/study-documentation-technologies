# Suporte a Novos Media Types (XML)

---

## 1. Introdução

O **Content Negotiation** (negociação de conteúdo) é um mecanismo fundamental em aplicações RESTful que permite ao servidor oferecer respostas em diferentes formatos (por exemplo, JSON, XML) conforme a preferência do cliente. No Spring Boot, esse comportamento é gerenciado automaticamente por meio de *message converters* (conversores de mensagem) e configurações padrões de negociação. Neste guia, exploraremos:

- Como funciona o comportamento padrão de content negotiation no Spring Boot;
- De que forma podemos personalizar essa negociação (por exemplo, permitindo que a extensão “.xml” seja resolvida ou que parâmetros de URL determinem o formato);
- Como adicionar suporte a novos *media types* (no exemplo, XML) de forma simplificada.

---

## 2. Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#3-conceitos-fundamentais)
2. [Comportamento Padrão no Spring Boot](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#4-comportamento-padr%C3%A3o-no-spring-boot)
3. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#5-sintaxe-detalhada-e-uso-pr%C3%A1tico)
    1. Configuração via `application.properties`
    2. Configuração por meio de `WebMvcConfigurer`
    3. Exemplos de Controladores com Produces/Consumes
4. [Adicionando Suporte a XML](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#6-adicionando-suporte-a-xml)
    1. Dependências no `pom.xml`
    2. Configuração de *Message Converters* para XML
    3. Exemplos Práticos (JSON ↔ XML)
5. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#7-cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
6. [Componentes-Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#8-componentes-chave-associados)
    1. `ContentNegotiationConfigurer`
    2. Estratégias de Content Negotiation
    3. `HttpMessageConverter` e Derivados
    4. Anotações `@RequestMapping`, `@GetMapping`, `produces`, `consumes`
7. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#9-melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
8. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#10-exemplo-pr%C3%A1tico-completo)
    1. Estrutura de Projeto
    2. `pom.xml` (dependências)
    3. Configuração de Content Negotiation
    4. Entidade e Repositório
    5. Controlador REST (JSON e XML)
    6. Testes de API com `curl`
9. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#11-sugest%C3%B5es-para-aprofundamento)

---

## 3. Conceitos Fundamentais

Antes de mergulhar na configuração, é crucial entender alguns conceitos básicos:

1. **Content Negotiation (Negociação de Conteúdo):**
    - Processo pelo qual o cliente (por exemplo, um navegador ou outra aplicação) informa ao servidor o formato desejado para a resposta. Isso ocorre, tipicamente, por meio do cabeçalho HTTP `Accept` (e, em alguns casos, extensão de arquivo ou parâmetro de URL).
    - O servidor, por sua vez, verifica quais formatos consegue fornecer e responde conforme a melhor correspondência entre as preferências do cliente e os formatos suportados internamente.
2. **Media Type (MIME Type):**
    - Representa o tipo de mídia/formato de dados (por exemplo, `application/json`, `application/xml`, `text/plain`).
    - Na negociação de conteúdo, ambos—cliente e servidor—têm listas ordenadas de *media types* preferenciais.
3. **HttpMessageConverter (Conversor de Mensagem):**
    - Interface do Spring que realiza a conversão de objetos Java para a representação no formato escolhido (JSON, XML, etc.) e vice-versa.
    - Exemplo: `MappingJackson2HttpMessageConverter` (para JSON com Jackson) ou `MappingJackson2XmlHttpMessageConverter` (para XML com Jackson-dataformat-xml).
4. **Estratégias de Negociação de Conteúdo (Content Negotiation Strategy):**
    - **Accept Header Strategy:** baseia-se no cabeçalho HTTP `Accept`.
    - **Path Extension Strategy:** baseia-se na extensão do caminho (por exemplo, `/pessoa/1.xml`).
    - **Parameter Strategy:** usa parâmetro de consulta (por exemplo, `/pessoa/1?format=xml`).
    - **Fixed Strategy:** define sempre um único formato, independente do pedido do cliente.
5. **`produces` e `consumes`:**
    - Atributos das anotações de mapeamento (`@RequestMapping`, `@GetMapping` etc.) que definem explicitamente quais *media types* o método suporta para resposta (`produces`) ou requisição (`consumes`).

---

## 4. Comportamento Padrão no Spring Boot

Por padrão, ao usar **Spring Boot Starter Web**, o framework já inclui diversos *HttpMessageConverters* registrados automaticamente, dentre eles:

- **Para JSON:** `MappingJackson2HttpMessageConverter` (Jackson)
- **Para XML (caso disponível no classpath):** `MappingJackson2XmlHttpMessageConverter` ou `Jaxb2RootElementHttpMessageConverter` (JAXB), dependendo das dependências.

### 4.1. Fluxo de Trabalho Simplificado

1. Cliente envia requisição HTTP a um endpoint REST, sem especificar, por exemplo, extensão no URL.
2. O Spring examina o cabeçalho `Accept` (por exemplo, `Accept: application/json` ou `Accept: application/xml`).
3. O **ContentNegotiationManager**, com base em estratégias configuradas internamente, define qual `HttpMessageConverter` será usado para serializar o objeto de retorno.
4. O conversor escolhido transforma o objeto Java (ex.: `Pessoa`) em JSON ou XML, e a resposta é enviada com o `Content-Type` adequado (ex.: `application/json;charset=UTF-8`).

### 4.2. Configuração Padrão

- **Header-Based (Accept Header):** É a estratégia padrão.
- **Path Extension:** Por questões de segurança, a partir de **Spring 5.2+** (e, consequentemente, em versões mais recentes do Spring Boot), a estratégia de extensão no *path* está **desabilitada** por padrão. Se quisermos reativá-la, precisamos explicitar em nossa configuração.

---

## 5. Sintaxe Detalhada e Uso Prático

### 5.1. Configuração via `application.properties` (ou `application.yml`)

Algumas propriedades podem ajustar o comportamento de content negotiation:

```
# --- application.properties ---

# 1. Definir media type padrão caso o Accept header não seja fornecido
spring.mvc.contentnegotiation.favor-path-extension=false   # impede usar extensão no caminho
spring.mvc.contentnegotiation.favor-parameter=false        # impede usar parâmetro ?format=
spring.mvc.contentnegotiation.ignore-accept-header=false   # NÃO ignore o header Accept (padrão: false)
spring.mvc.contentnegotiation.default-content-type=application/json  # formato padrão

# 2. Caso deseje ativar uso de extensão no path (ex: /pessoa/1.xml)
spring.mvc.contentnegotiation.favor-path-extension=true
# Podemos também mapear extensão => media type customizado:
spring.mvc.contentnegotiation.media-types.xml=application/xml
spring.mvc.contentnegotiation.media-types.json=application/json

```

> Observação:
> 
> - `favor-path-extension` (padrão: `false` a partir de Spring Boot 2.6+) controla se o Spring deve interpretar a extensão no path (ex: `.xml`, `.json`) para decidir o formato de resposta.
> - `favor-parameter` habilita o uso de um parâmetro de query (ex: `?format=xml`) na negociação.
> - `ignore-accept-header` define se ignoramos ou não o cabeçalho `Accept`. Se `true`, o Spring sempre usará o `default-content-type`.

### 5.2. Configuração por meio de `WebMvcConfigurer`

Para ganhar controle mais fino sobre as estratégias, implementamos `WebMvcConfigurer` e sobrescrevemos o método `configureContentNegotiation(ContentNegotiationConfigurer configurer)`:

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
            // 1. Permitir que o header 'Accept' seja avaliado
            .favorParameter(false)             // não usar ?format=
            .ignoreAcceptHeader(false)         // considerar o header Accept
            // 2. Configurar extensão de arquivo (caso necessário)
            .favorPathExtension(false)         // não usar .xml/.json por padrão
            // 3. Definir qual media type usar caso não haja header Accept
            .defaultContentType(MediaType.APPLICATION_JSON)
            // 4. Mapear extensões a media types (caso favorPathExtension=true)
            .mediaType("json", MediaType.APPLICATION_JSON)
            .mediaType("xml", MediaType.APPLICATION_XML);
    }
}

```

### 5.2.1. Principais Métodos de `ContentNegotiationConfigurer`

- **`favorPathExtension(boolean valor)`**
    
    Indica se queremos ou não que a extensão no final da URL (ex: `.xml`) seja considerada.
    
- **`favorParameter(boolean valor)`**
    
    Permite ou não o uso de um parâmetro (padrão: `format`) na URL, ex: `?format=xml`.
    
- **`ignoreAcceptHeader(boolean valor)`**
    
    Se for `true`, o cabeçalho `Accept` é desconsiderado e sempre usamos o `defaultContentType`.
    
- **`defaultContentType(MediaType mediaType)`**
    
    Define o *media type* de fallback quando não há informação de preferência do cliente.
    
- **`mediaType(String extensão, MediaType mediaType)`**
    
    Mapeia uma extensão (sem o ponto) ao respectivo `MediaType`.
    
- **`useRegisteredExtensionsOnly(boolean valor)`**
    
    Se `true`, apenas extensões explicitamente mapeadas via `.mediaType()` são consideradas; caso contrário, qualquer extensão presente será interpretada automaticamente.
    

### 5.3. Exemplos de Controladores com `produces` e `consumes`

Definindo, em nível de método ou de classe, quais formatos são suportados:

```java
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pessoas")
public class PessoaController {

    // Exemplo 1: responde apenas JSON (mesmo que cliente peça XML, retornará 406 Not Acceptable)
    @GetMapping(path = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Pessoa> buscarPessoaJson(@PathVariable Long id) {
        Pessoa pessoa = encontrarPessoaPorId(id);
        return ResponseEntity.ok(pessoa);
    }

    // Exemplo 2: aceita JSON ou XML dinamicamente conforme Accept header
    @GetMapping(path = "/{id}/flex", produces = {
            MediaType.APPLICATION_JSON_VALUE,
            MediaType.APPLICATION_XML_VALUE
        })
    public ResponseEntity<Pessoa> buscarPessoaFlex(@PathVariable Long id) {
        Pessoa pessoa = encontrarPessoaPorId(id);
        return ResponseEntity.ok(pessoa);
    }

    // Exemplo 3: método para criar Pessoa, recebendo JSON ou XML
    @PostMapping(
        consumes = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE },
        produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE }
    )
    public ResponseEntity<Pessoa> criarPessoa(@RequestBody Pessoa novaPessoa) {
        Pessoa salva = salvarPessoa(novaPessoa);
        return ResponseEntity.status(201).body(salva);
    }

    // Métodos fictícios para buscar/salvar
    private Pessoa encontrarPessoaPorId(Long id) { /* ... */ return new Pessoa(id, "João"); }
    private Pessoa salvarPessoa(Pessoa p) { /* ... */ return p; }
}

class Pessoa {
    private Long id;
    private String nome;
    // getters, setters, construtores omitidos
}

```

- No **Exemplo 1**, mesmo que o cliente envie `Accept: application/xml`, o Spring só suportará JSON e responderá com status 406 (Not Acceptable) se não puder produzir JSON.
- No **Exemplo 2**, o Spring decidirá entre JSON ou XML conforme o cabeçalho `Accept` (por exemplo, `Accept: application/xml` retornará XML).
- No **Exemplo 3**, além de responder em JSON ou XML, o método também aceita corpo da requisição em JSON ou XML, convertendo automaticamente para o objeto `Pessoa`.

---

## 6. Adicionando Suporte a XML

Para que o Spring Boot produza e consuma XML, é preciso garantir que haja um **HttpMessageConverter** adequado no classpath. A seguir, veremos como fazer isso.

### 6.1. Dependências no `pom.xml`

Para habilitar processamento de XML com Jackson (recomendado):

```xml
<!-- Dependência principal do Spring Boot Web (JSON por padrão) -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- Dependência para suporte a XML com Jackson -->
<dependency>
    <groupId>com.fasterxml.jackson.dataformat</groupId>
    <artifactId>jackson-dataformat-xml</artifactId>
</dependency>

<!-- Opcional: JAXB (caso queira usar anotações @XmlRootElement, etc.) -->
<dependency>
    <groupId>javax.xml.bind</groupId>
    <artifactId>jaxb-api</artifactId>
</dependency>
<dependency>
    <groupId>org.glassfish.jaxb</groupId>
    <artifactId>jaxb-runtime</artifactId>
</dependency>

```

> Por quê Jackson-dataformat-xml?
> 
> - Ele fornece automaticamente um conversor `MappingJackson2XmlHttpMessageConverter`. A vantagem é manter consistência (mesmo modelo de serialização usado em JSON, só que para XML).
> - Se for usar JAXB puro (anotações `@XmlRootElement`, etc.), o Spring também registra, via `Jaxb2RootElementHttpMessageConverter`, mas é menos flexível que Jackson em alguns casos.

### 6.2. Configurando *Message Converters* para XML (opcional)

Caso seja necessário customizar o conversor (por exemplo, habilitar indentação, aliases, namespaces), podemos sobrescrever o `Jackson2ObjectMapperBuilder` no contexto:

```java
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.xml.MappingJackson2XmlHttpMessageConverter;

@Configuration
public class XmlConfig {

    @Bean
    public MappingJackson2XmlHttpMessageConverter xmlHttpMessageConverter() {
        // Configura XmlMapper com indentação e outros recursos
        XmlMapper xmlMapper = new XmlMapper();
        xmlMapper.enable(SerializationFeature.INDENT_OUTPUT);
        // Outras customizações (ex.: permitir anotações JAXB)
        // xmlMapper.registerModule(new JaxbAnnotationModule());

        return new MappingJackson2XmlHttpMessageConverter(xmlMapper);
    }
}

```

Ao expor esse *bean*, o Spring o adicionará à lista de `HttpMessageConverters` **anterior** ao conversor JSON, garantindo que XML seja avaliado quando necessário.

### 6.3. Exemplos Práticos (JSON ↔ XML)

**Exemplo de Entidade Anotada para XML:**

```java
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

@JacksonXmlRootElement(localName = "pessoa")
public class Pessoa {

    @JacksonXmlProperty(localName = "id")
    private Long id;

    @JacksonXmlProperty(localName = "nome")
    private String nome;

    public Pessoa() { /* Construtor vazio obrigatório para desserialização */ }

    public Pessoa(Long id, String nome) {
        this.id = id;
        this.nome = nome;
    }

    // getters e setters
}

```

**Requisição e Resposta JSON → XML:**

1. **GET** `http://localhost:8080/api/pessoas/1`
    - **Header:** `Accept: application/json`
    - **Response:**
        
        ```json
        {
          "id": 1,
          "nome": "João"
        }
        
        ```
        
    - **Header de resposta:**
        
        `Content-Type: application/json;charset=UTF-8`
        
2. **GET** `http://localhost:8080/api/pessoas/1`
    - **Header:** `Accept: application/xml`
    - **Response:**
        
        ```xml
        <pessoa>
          <id>1</id>
          <nome>João</nome>
        </pessoa>
        
        ```
        
    - **Header de resposta:**
        
        `Content-Type: application/xml`
        
3. **GET** `http://localhost:8080/api/pessoas/1.xml` (caso `favorPathExtension=true` e `mediaType("xml", application/xml)`)
    - **Sem header “Accept”**; o Spring detecta a extensão `.xml` e retorna XML.
    - **Header de resposta:**
        
        `Content-Type: application/xml`
        

---

## 7. Cenários de Restrição ou Não Aplicação

Em determinadas situações, a negociação de conteúdo pode não ser recomendada ou deve ser desabilitada:

1. **APIs Internas ou de Alto Desempenho que Sempre Retornam um Formato Único:**
    - Se todos os clientes concordam em trabalhar com JSON, não faz sentido manter código e configuração para múltiplos formatos.
    - Simplifica o contrato e evita overhead de múltiplos *message converters*.
2. **Recursos Estáticos (CSS/JS/Imagem):**
    - Normalmente não passamos por “controllers” REST, mas por mapeamentos diretos de arquivos estáticos. O content negotiation aqui não se aplica diretamente.
3. **Cenários de Cache e CDNs:**
    - Algumas CDNs podem indevidamente cachear respostas por extensão (ex.: /recurso/1.xml) sem distinguir `Accept`. Se não estiver bem configurado, pode haver cache incorreto em formato errado.
4. **Microserviços Legados sem Suporte a Certos Conversores:**
    - Se você usa bibliotecas legadas que não suportam JAXB ou Jackson para XML, pode ser mais trabalhoso habilitar XML. Nesses casos, limitar-se a JSON pode ser mais prático.

---

## 8. Componentes-Chave Associados

### 8.1. `ContentNegotiationConfigurer`

- **Pacote:** `org.springframework.web.servlet.config.annotation`
- **Função:** Permite configurar as estratégias de negociação (extensão de path, parâmetro, header).
- **Principais Métodos:**
    - `favorPathExtension(boolean)`: ativa/desativa uso de extensão no URL.
    - `favorParameter(boolean)`: ativa/desativa uso de parâmetro (ex: `?format=`).
    - `ignoreAcceptHeader(boolean)`: se `true`, ignora cabeçalho `Accept`.
    - `defaultContentType(MediaType)`: define formato padrão.
    - `mediaType(String extensão, MediaType)`: mapeia extensão a *media type*.
    - `useRegisteredExtensionsOnly(boolean)`: obriga que só extensões registradas com `.mediaType()` sejam aceitas.

### 8.2. Estratégias de Content Negotiation

- **`HeaderContentNegotiationStrategy`:** leva em conta o campo `Accept`.
- **`PathExtensionContentNegotiationStrategy`:** verifica a extensão no caminho (ex: `.xml`).
- **`ParameterContentNegotiationStrategy`:** lê um parâmetro de query string para definir formato (ex: `?format=xml`).
- **`FixedContentNegotiationStrategy`:** força sempre um único formato (independente de cabeçalhos).

O Spring Boot, por padrão (caso não sobreponha a configuração), usa:

```java
new HeaderContentNegotiationStrategy()

```

Para habilitar PATH_EXTENSION, PARAMETER ou FIXED, é necessário explicitar via `configureContentNegotiation(...)`.

### 8.3. `HttpMessageConverter` e Derivados

Responsáveis por converter objetos Java ↔ fluxos HTTP. Alguns exemplos:

- **`MappingJackson2HttpMessageConverter`** (JSON)
- **`MappingJackson2XmlHttpMessageConverter`** (XML via Jackson-dataformat-xml)
- **`Jaxb2RootElementHttpMessageConverter`** (XML via JAXB)
- **`StringHttpMessageConverter`** (texto plain)

A ordem em que esses conversores são registrados importa: o Spring verifica cada conversor na lista até encontrar um que suporte o `mediaType` desejado.

### 8.4. Anotações `@RequestMapping`, `@GetMapping`, `produces` e `consumes`

- **`produces`**: define quais *media types* o método retorna.
- **`consumes`**: define quais *media types* o método aceita no corpo da requisição (`@RequestBody`).
- Se nenhum desses atributos for declarado, o Spring retorna todos os *media types* suportados pelos conversores cadastrados (respeitando o `Accept`).

**Exemplo de uso múltiplo**:

```java
@GetMapping(path = "/exemplo",
            produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE })
public ResponseEntity<Exemplo> obterExemplo() { /* ... */ }

```

---

## 9. Melhores Práticas e Padrões de Uso

1. **Priorize o Cabeçalho `Accept` em vez de Extensão no Path:**
    - Usar extensões nos endpoints (ex: `/recurso/1.xml`) pode introduzir problemas de segurança e ambiguidade (por exemplo, se o recurso de fato tem nome “arquivo.xml”).
    - O cabeçalho `Accept` é a forma mais RESTful e recomendada pela especificação HTTP.
2. **Documente Claramente os Formatos Suportados pela API:**
    - Use Swagger/OpenAPI para especificar, em cada endpoint, quais `produces` e `consumes` são permitidos.
    - Exemplo em `@Operation` (OpenAPI):
        
        ```java
        @Operation(summary = "Obter pessoa",
                   responses = {
                     @ApiResponse(content = @Content(mediaType = "application/json")),
                     @ApiResponse(content = @Content(mediaType = "application/xml"))
                   })
        
        ```
        
3. **Defina um Formato Padrão Bem Conhecido:**
    - Caso o cliente não envie `Accept`, use `.defaultContentType(MediaType.APPLICATION_JSON)` ou outro de sua escolha.
    - Garanta que a maioria dos clientes consigam interpretar esse formato.
4. **Evite Conflitos Entre Estratégias:**
    - Se habilitar `favorPathExtension=true` e `favorParameter=true`, clientes podem ficar confusos em relação à prioridade.
    - A ordem de configuração em `configureContentNegotiation(...)` define a precedência.
5. **Cuidado com Converters em Ambientes de Alta Escalabilidade:**
    - Alguns conversores XML (como JAXB) podem ser mais lentos ou gerar overhead. Se o volume for alto, fique atento ao impacto na performance.
    - Avalie compressão (GZIP) e cacheamento adequado (HTTP Caching) para minimizar custos de serialização.
6. **Consistência de Modelos (POJOs):**
    - As classes de domínio devem possuir construtores sem argumentos e getters/setters públicos para que o mapeamento JSON↔Java ou XML↔Java funcione corretamente.
    - Use anotações como `@JacksonXmlRootElement`, `@JacksonXmlProperty` ou `@XmlRootElement`, `@XmlElement` para controlar nomes de elementos e namespaces em XML.
7. **Teste Automatizado de Ecossistema de Content Negotiation:**
    - Crie testes de integração que simulam requisições com diferentes `Accept`, garantindo que o JSON e XML estejam corretos e válidos.
    - Valide as respostas (ex.: usando `MockMvc` com `accept(MediaType.APPLICATION_XML)` e comparando o payload gerado).
8. **Segurança e Filtragem de Extensões (caso use Path Extension):**
    - Desabilite `useRegisteredExtensionsOnly(false)` se não quiser que extensões inesperadas sejam mapeadas automaticamente (ex.: “.html”, “.jsp”).
    - Habilite somente as extensões mapeadas explicitamente (ex.: `.json`, `.xml`).

---

## 10. Exemplo Prático Completo

A seguir, veremos um projeto Spring Boot minimalista que expõe um recurso “Pessoa” e permite consumo/produção em JSON e XML.

### 10.1. Estrutura de Projeto (resumida)

```
spring-content-negotiation/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/exemplo/
│   │   │       ├── config/
│   │   │       │   └── WebConfig.java
│   │   │       ├── controller/
│   │   │       │   └── PessoaController.java
│   │   │       ├── model/
│   │   │       │   └── Pessoa.java
│   │   │       └── SpringContentNegotiationApplication.java
│   │   └── resources/
│   │       └── application.properties
├── pom.xml

```

### 10.2. `pom.xml` (Dependências Essenciais)

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
                             http://maven.apache.org/maven-v4_0_0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.exemplo</groupId>
  <artifactId>spring-content-negotiation</artifactId>
  <version>0.0.1-SNAPSHOT</version>
  <packaging>jar</packaging>

  <properties>
    <java.version>17</java.version>
    <spring-boot.version>3.1.4</spring-boot.version>
  </properties>

  <dependencies>
    <!-- Starter Web inclui Jackson JSON -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- Jackson Dataformat XML -->
    <dependency>
      <groupId>com.fasterxml.jackson.dataformat</groupId>
      <artifactId>jackson-dataformat-xml</artifactId>
    </dependency>

    <!-- Opcional: JAXB (caso queira usar anotações JAXB) -->
    <dependency>
      <groupId>javax.xml.bind</groupId>
      <artifactId>jaxb-api</artifactId>
    </dependency>
    <dependency>
      <groupId>org.glassfish.jaxb</groupId>
      <artifactId>jaxb-runtime</artifactId>
    </dependency>

    <!-- Testes -->
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

### 10.3. `application.properties`

```
# Configuração de content negotiation
spring.mvc.contentnegotiation.favor-path-extension=false
spring.mvc.contentnegotiation.favor-parameter=false
spring.mvc.contentnegotiation.ignore-accept-header=false
spring.mvc.contentnegotiation.default-content-type=application/json

# Mapeamento de extensões (caso futuramente queira habilitar)
# spring.mvc.contentnegotiation.media-types.json=application/json
# spring.mvc.contentnegotiation.media-types.xml=application/xml

```

### 10.4. Configuração de Content Negotiation: `WebConfig.java`

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
            .favorPathExtension(false)             // não usar extensão .json/.xml
            .favorParameter(false)                 // não usar ?format=
            .ignoreAcceptHeader(false)             // considerar header Accept
            .defaultContentType(MediaType.APPLICATION_JSON)  // fallback JSON
            .mediaType("json", MediaType.APPLICATION_JSON)
            .mediaType("xml", MediaType.APPLICATION_XML);
    }
}

```

### 10.5. Entidade `Pessoa.java`

```java
package com.exemplo.model;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

@JacksonXmlRootElement(localName = "pessoa")
public class Pessoa {

    @JacksonXmlProperty(localName = "id")
    private Long id;

    @JacksonXmlProperty(localName = "nome")
    private String nome;

    public Pessoa() { }

    public Pessoa(Long id, String nome) {
        this.id = id;
        this.nome = nome;
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
}

```

### 10.6. Controlador `PessoaController.java`

```java
package com.exemplo.controller;

import com.exemplo.model.Pessoa;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pessoas")
public class PessoaController {

    // GET /api/pessoas/1  → retorna JSON ou XML conforme Accept
    @GetMapping(
      path = "/{id}",
      produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE }
    )
    public ResponseEntity<Pessoa> buscarPorId(
            @PathVariable Long id) {
        // Simulação de busca
        Pessoa pessoa = new Pessoa(id, "Maria Silva");
        return ResponseEntity.ok(pessoa);
    }

    // POST /api/pessoas  → aceita JSON ou XML para criação
    @PostMapping(
      consumes = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE },
      produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE }
    )
    public ResponseEntity<Pessoa> criar(
            @RequestBody Pessoa novaPessoa) {
        // Simulação de “salvamento”
        novaPessoa.setId(123L);
        return ResponseEntity.status(201).body(novaPessoa);
    }
}

```

### 10.7. Classe Principal: `SpringContentNegotiationApplication.java`

```java
package com.exemplo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SpringContentNegotiationApplication {
    public static void main(String[] args) {
        SpringApplication.run(SpringContentNegotiationApplication.class, args);
    }
}

```

### 10.8. Testando com `curl`

1. **JSON (GET):**
    
    ```bash
    curl -v -H "Accept: application/json" http://localhost:8080/api/pessoas/1
    
    ```
    
    **Resposta Esperada:**
    
    ```json
    {
      "id": 1,
      "nome": "Maria Silva"
    }
    
    ```
    
    **Headers:**
    
    ```
    Content-Type: application/json
    
    ```
    
2. **XML (GET):**
    
    ```bash
    curl -v -H "Accept: application/xml" http://localhost:8080/api/pessoas/1
    
    ```
    
    **Resposta Esperada:**
    
    ```xml
    <pessoa>
      <id>1</id>
      <nome>Maria Silva</nome>
    </pessoa>
    
    ```
    
    **Headers:**
    
    ```
    Content-Type: application/xml
    
    ```
    
3. **Criação (POST JSON → JSON):**
    
    ```bash
    curl -v -X POST -H "Content-Type: application/json" \
         -d '{"nome": "Carlos Oliveira"}' \
         http://localhost:8080/api/pessoas
    
    ```
    
    **Resposta Esperada:**
    
    ```json
    {
      "id": 123,
      "nome": "Carlos Oliveira"
    }
    
    ```
    
4. **Criação (POST XML → XML):**
    
    ```bash
    curl -v -X POST -H "Content-Type: application/xml" \
         -d '<pessoa><nome>Carlos Oliveira</nome></pessoa>' \
         http://localhost:8080/api/pessoas
    
    ```
    
    **Resposta Esperada:**
    
    ```xml
    <pessoa>
      <id>123</id>
      <nome>Carlos Oliveira</nome>
    </pessoa>
    
    ```
    

Se tudo estiver configurado corretamente, o Spring identificará automaticamente o formato de entrada e saída com base nos cabeçalhos `Content-Type` (para requisições) e `Accept` (para respostas).

---

## 11. Sugestões para Aprofundamento

- **Documentação Oficial do Spring (Content Negotiation):**
    
    [https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-config-content-negotiation](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-config-content-negotiation)
    
- **Guia de Jackson XML:**
    
    [https://github.com/FasterXML/jackson-dataformat-xml](https://github.com/FasterXML/jackson-dataformat-xml)
    
- **OpenAPI/Swagger + Content Negotiation:**
    
    Veja como documentar múltiplos *media types* em YAML/JSON do OpenAPI para gerar documentação atualizada.
    
- **Testes de Integração com `MockMvc`:**
    
    Pesquise “Spring MockMvc content negotiation test” para aprender a escrever testes automatizados que validem JSON e XML para seus endpoints.
    
- **Boas práticas REST API (Média Types, Versionamento e HATEOAS):**
    
    Aprofunde conceitos de versionamento baseado em conteúdo (ex.: `application/vnd.exemplo.v1+json`) e uso de hiperlinks (HATEOAS).
    

---

Com estes tópicos, você terá uma **visão geral concisa** do Content Negotiation no Spring Boot, assim como uma **explanação detalhada e completa**—incluindo exemplos de sintaxe, configurações, cenários de restrição, componentes-chave e um projeto de demonstração passo a passo que mostra como habilitar e consumir/produzir JSON e XML em uma aplicação real. Fique à vontade para adaptar as configurações e exemplos conforme a necessidade de seu projeto!