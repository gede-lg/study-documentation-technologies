# Content Negotiation Avançado e Customizado

---

## 1. Introdução

O Content Negotiation (negociação de conteúdo) é o mecanismo pelo qual um servidor e seus clientes (por exemplo, navegadores ou consumidores de API) concordam sobre o formato de representação de um recurso. Em aplicações REST, isso possibilita que a mesma URL atenda múltiplos formatos (JSON, XML, CSV, PDF etc.) sem alterar endpoints.

Nesta explanação, faremos primeiro uma **visão geral concisa** do Content Negotiation em Spring Boot e, em seguida, uma **abordagem detalhada** cobrindo:

- Implementação de *HttpMessageConverter* personalizados (por exemplo, CSV, PDF)
- Versionamento de API via cabeçalho `Accept`
- Criação de estratégias de negociação customizadas
- Testes de Content Negotiation com MockMvc

---

## 2. Sumário

1. **Visão Geral Concisa**
2. **Conceitos Fundamentais**
3. **Sintaxe Detalhada e Uso Prático**
    1. Configuração padrão de Content Negotiation no Spring Boot
    2. HttpMessageConverter personalizado para CSV
    3. HttpMessageConverter personalizado para PDF
    4. Versionamento de API via cabeçalho `Accept`
    5. Estratégias customizadas de Content Negotiation
4. **Cenários de Restrição ou Não Aplicação**
5. **Componentes-Chave Associados**
    - Anotações
    - Classes e Interfaces
    - Métodos e Atributos Cruciais
6. **Melhores Práticas e Padrões de Uso**
7. **Exemplo Prático Completo**
8. **Sugestões para Aprofundamento**

---

## 3. Visão Geral Concisa

- **O que é Content Negotiation?**
    
    Mecanismo que permite ao servidor oferecer múltiplas representações (por exemplo, JSON, XML, CSV, PDF) de um mesmo recurso com base no cabeçalho `Accept` do cliente ou em parâmetros de URL.
    
- **Por que usar?**
    1. **Flexibilidade:** Um único endpoint serve diferentes consumidores.
    2. **Evolução gradual:** Adicionar novos formatos sem romper clientes existentes.
    3. **Versionamento:** Permite versionar APIs via cabeçalho, isolando clientes de mudanças.
- **Fluxo Simplificado (Spring Boot Padrão):**
    1. Cliente envia requisição GET (ou POST) com `Accept: application/json` (ou outro media-type).
    2. Spring escolhe, dentre os *HttpMessageConverters* registrados, aquele que suporta o media-type solicitado.
    3. O conversor serializa o objeto Java para o formato desejado (por exemplo, JSON).
    4. Se o cliente solicitar “application/csv”, precisamos registrar um conversor CSV. Se solicitar “application/pdf”, registrar conversor PDF.
- **Customização Avançada:**
    1. Criar conversores (implementando `HttpMessageConverter<T>`) que geram CSV ou PDF a partir do objeto de domínio.
    2. Abaixar ou elevar prioridades de conversores padrão (JSON/XML) para priorizar ou despriorizar certos formatos.
    3. Versionar a API lendo valores do cabeçalho `Accept`, como `application/vnd.meuapp.v2+json`.
    4. Testar, via MockMvc, diferentes cenários de negociação, simulando cabeçalhos e validando status/code/response.

---

## 4. Conceitos Fundamentais

1. **Media Type (MIME Type):**
    - Identificador único de tipo de mídia (ex: `application/json`, `application/xml`, `text/csv`, `application/pdf`).
    - Cliente usa no cabeçalho `Accept` para informar qual representação deseja.
2. **HttpMessageConverter:**
    - Interface do Spring MVC responsável por converter entre objetos Java e payloads HTTP.
    - O Spring Boot já registra vários conversores: `MappingJackson2HttpMessageConverter` (JSON), `Jaxb2RootElementHttpMessageConverter` (XML), entre outros.
    - Para formatos não cobertos (CSV, PDF), é necessário implementar um conversor customizado.
3. **ContentNegotiationConfigurer e ContentNegotiationManager:**
    - `ContentNegotiationConfigurer` (normalmente acessado pelo método `configureContentNegotiation(ContentNegotiationConfigurer config)`) permite customizar parâmetros como:
        - Estratégia por extensão de caminho (e.g. `.json`, `.xml`).
        - Estratégia por parâmetro de URL (e.g. `?format=json`).
        - Estratégia por cabeçalho HTTP (`Accept`), que geralmente é a mais recomendada.
    - `ContentNegotiationManager` é o componente gerado a partir desse config, que decide qual media type usar.
4. **Versionamento via Accept Header (“Media Type Versioning”):**
    - Em vez de alterar URIs para versionar (como `/v1/meus-recursos`), usa-se o cabeçalho `Accept`:
        - Exemplo: `Accept: application/vnd.meuapp.v2+json`.
    - O conversor lê a parte `vnd.meuapp.v2` e carrega a versão correspondente dos recursos.
    - Permite manter URIs limpas e forçar clientes a especificar versão.
5. **MockMvc para Testes de Content Negotiation:**
    - O módulo `spring-test` fornece `MockMvc` para simular requisições HTTP no nível do dispatcher servlet, permitindo:
        - Definir cabeçalhos `Accept`.
        - Invocar endpoints e verificar resposta (status, conteúdo, headers).
        - Validar se o conversor correto foi acionado (por exemplo, verificando o formato).

---

## 5. Sintaxe Detalhada e Uso Prático

### 5.1. Configuração Padrão de Content Negotiation

```java
// 1. Crie uma classe de configuração que estenda WebMvcConfigurer
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
        // Ativa o uso de cabeçalho "Accept"
        configurer
            .favorParameter(false)        // Não usa parâmetro de URL (ex: ?format=json)
            .ignoreAcceptHeader(false)     // Usa header "Accept"
            .defaultContentType(MediaType.APPLICATION_JSON) // Caso não haja header, retorna JSON
            .mediaType("json", MediaType.APPLICATION_JSON)
            .mediaType("xml", MediaType.APPLICATION_XML)
            .mediaType("csv", MediaType.valueOf("text/csv"));
    }
}

```

> Explicação comentada:
> 
> - `favorParameter(false)`: diz ao Spring para **não** considerar parâmetros de query (ex: `?format=xml`).
> - `ignoreAcceptHeader(false)`: força o Spring a **considerar** o cabeçalho `Accept` enviado pelo cliente.
> - `defaultContentType(...)`: define o formato padrão quando nenhum `Accept` for enviado.
> - `mediaType("csv", "text/csv")`: registra abreviações; útil se você também quisesse aceitar algo como `/meus?format=csv`, mas aqui visamos o cabeçalho.

### 5.1.1. Bean para configurar `MessageConverters` adicionais

```java
@Override
public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
    // Conversores padrão (JSON/XML) já estão registrados
    // Aqui, podemos adicionar conversor para CSV e PDF
    converters.add(new CsvMessageConverter());
    converters.add(new PdfMessageConverter());
}

```

- `extendMessageConverters(...)`: método que permite inserir conversores **após** a lista padrão. Se você quisesse substituir um conversor padrão, usaria `configureMessageConverters(...)` (que limpa a lista antes).

---

### 5.2. Criando HttpMessageConverter Personalizado para CSV

### 5.2.1. Dependências (opcional)

Para gerar CSV, podemos usar bibliotecas como [OpenCSV](http://opencsv.sourceforge.net/) ou [Apache Commons CSV](https://commons.apache.org/proper/commons-csv/). Exemplo usando Apache Commons CSV no Maven:

```xml
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-csv</artifactId>
    <version>1.9.0</version>
</dependency>

```

### 5.2.2. Implementação do `CsvMessageConverter`

```java
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.MediaType;
import org.springframework.http.converter.AbstractHttpMessageConverter;

import java.io.OutputStreamWriter;
import java.io.Writer;
import java.nio.charset.StandardCharsets;
import java.util.List;

// 1. Extendemos AbstractHttpMessageConverter<List<MyModel>> para converter listas de objetos
public class CsvMessageConverter extends AbstractHttpMessageConverter<List<MyModel>> {

    // 2. Definimos o media type suportado: text/csv
    public CsvMessageConverter() {
        super(new MediaType("text", "csv", StandardCharsets.UTF_8));
    }

    @Override
    protected boolean supports(Class<?> clazz) {
        // 3. Indicamos que suportamos listas de MyModel (ou altere para Collection<?> genérico)
        return List.class.isAssignableFrom(clazz);
    }

    @Override
    protected List<MyModel> readInternal(Class<? extends List<MyModel>> clazz, HttpInputMessage inputMessage) {
        // 4. Se não for necessário ler CSV do request, podemos lançar UnsupportedOperation
        throw new UnsupportedOperationException("Leitura de CSV não suportada.");
    }

    @Override
    protected void writeInternal(List<MyModel> objetos, HttpOutputMessage outputMessage) throws IOException {
        // 5. Recebe lista de MyModel e gera CSV
        outputMessage.getHeaders().setContentType(new MediaType("text", "csv", StandardCharsets.UTF_8));
        Writer writer = new OutputStreamWriter(outputMessage.getBody(), StandardCharsets.UTF_8);

        // 6. Exemplo usando Apache Commons CSV
        try (CSVPrinter csvPrinter = new CSVPrinter(writer,
                CSVFormat.DEFAULT
                    .withHeader("id", "nome", "valor"))) {
            for (MyModel obj : objetos) {
                csvPrinter.printRecord(obj.getId(), obj.getNome(), obj.getValor());
            }
        }
    }
}

```

> Detalhes importantes:
> 
> - **Genericidade:** Você pode parametrizar para `List<T>` e usar reflexão para gerar cabeçalhos, mas é comum criar um conversor específico para cada DTO.
> - **Charset UTF-8:** Responsável para evitar problemas com acentuação.
> - **Leitura vs. Escrita:** Se sua API precisar receber CSV (por exemplo, upload), implemente também `readInternal`. Caso contrário, lance `UnsupportedOperationException`.

### 5.2.3. Classe de Modelo Exemplo

```java
public class MyModel {
    private Long id;
    private String nome;
    private BigDecimal valor;

    // Construtor, getters e setters omitidos para brevidade
}

```

### 5.2.4. Registro do Conversor

Em sua classe de configuração (conforme seção 5.1):

```java
@Override
public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
    converters.add(new CsvMessageConverter());
}

```

Agora, quando um cliente fizer:

```
GET /api/meus-modelos
Accept: text/csv

```

O Spring usará `CsvMessageConverter` para serializar a lista de `MyModel` em CSV.

---

### 5.3. Criando HttpMessageConverter Personalizado para PDF

Para PDF, podemos usar bibliotecas como iText ou Apache PDFBox. Abaixo, exemplo simplificado usando o **iText 7** (versão compatível com licença AGPL ou comercial).

### 5.3.1. Dependência no Maven (iText 7 básico)

```xml
<dependency>
    <groupId>com.itextpdf</groupId>
    <artifactId>kernel</artifactId>
    <version>7.2.2</version>
</dependency>
<dependency>
    <groupId>com.itextpdf</groupId>
    <artifactId>layout</artifactId>
    <version>7.2.2</version>
</dependency>

```

### 5.3.2. Implementação do `PdfMessageConverter`

```java
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.MediaType;
import org.springframework.http.converter.AbstractHttpMessageConverter;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

public class PdfMessageConverter extends AbstractHttpMessageConverter<Object> {

    // Suporta "application/pdf"
    public PdfMessageConverter() {
        super(MediaType.APPLICATION_PDF);
    }

    @Override
    protected boolean supports(Class<?> clazz) {
        // Podemos suportar qualquer tipo, contanto que o controller retorne um objeto esperado
        return true;
    }

    @Override
    protected Object readInternal(Class<?> clazz, HttpInputMessage inputMessage) {
        throw new UnsupportedOperationException("Leitura de PDF não suportada.");
    }

    @Override
    protected void writeInternal(Object objeto, HttpOutputMessage outputMessage) throws IOException {
        outputMessage.getHeaders().setContentType(MediaType.APPLICATION_PDF);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        // 1. Cria o writer e o documento
        PdfWriter writer = new PdfWriter(baos);
        Document document = new Document(new com.itextpdf.kernel.pdf.PdfDocument(writer));

        // 2. Exemplo simples: adiciona título e detalhes de objeto via toString()
        document.add(new Paragraph("Relatório em PDF"));
        document.add(new Paragraph("Dados do objeto: " + objeto.toString()));

        // 3. Fechar documento
        document.close();

        // 4. Escrever bytes no output HTTP
        outputMessage.getBody().write(baos.toByteArray());
    }
}

```

> Observações:
> 
> - O conversor acima é genérico: qualquer objeto passado será convertido em um PDF simples contendo `toString()`.
> - Em casos reais, crie métodos personalizados que geram tabelas, gráficos etc., com o iText.
> - Lembre sempre de fechar (`document.close()`) para liberar recursos.

### 5.3.3. Registro do Conversor PDF

Adicionar em `WebConfig`:

```java
@Override
public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
    converters.add(new CsvMessageConverter());
    converters.add(new PdfMessageConverter());
}

```

**Exemplo de requisição para PDF:**

```
GET /api/meus-modelos/123
Accept: application/pdf

```

O método do controller pode retornar diretamente o objeto (por exemplo, `MyModel`), e o conversor `PdfMessageConverter` cuidará da serialização.

---

### 5.4. Versionamento de API via Cabeçalho `Accept`

O **Media Type Versioning** consiste em criar media types customizados que contêm a versão da API. Exemplo:

```
Accept: application/vnd.minhaapi.v2+json

```

Nesse caso, o Spring precisa entender que quando o cliente pede `vnd.minhaapi.v2+json`, estamos falando de JSON, mas de uma versão específica (v2). Existem dois passos principais:

### 5.4.1. Definir o MediaType customizado

```java
public final class CustomMediaType {
    public static final MediaType V1_JSON = MediaType.valueOf("application/vnd.minhaapi.v1+json");
    public static final MediaType V2_JSON = MediaType.valueOf("application/vnd.minhaapi.v2+json");
    // Você pode criar variações para XML: application/vnd.minhaapi.v1+xml
}

```

### 5.4.2. Configurar o ContentNegotiationConfigurer para reconhecer os media types

```java
@Override
public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
    configurer
        .favorParameter(false)
        .ignoreAcceptHeader(false)
        .defaultContentType(MediaType.APPLICATION_JSON)
        .mediaType("v1", CustomMediaType.V1_JSON)
        .mediaType("v2", CustomMediaType.V2_JSON)
        .mediaType("json", MediaType.APPLICATION_JSON);
}

```

> Detalhe: Podemos mapear as keys v1, v2 caso também quiséssemos permitir .v1 ou .v2 na URL (e.g., /recurso.v2), mas, de modo geral, o Spring tirará o media type diretamente do cabeçalho Accept.
> 

### 5.4.3. Anotar controllers ou métodos para cada versão

Imagine que temos dois controllers, um para v1 e outro para v2:

```java
@RestController
@RequestMapping("/api/clientes")
public class ClienteControllerV1 {

    @GetMapping(produces = "application/vnd.minhaapi.v1+json")
    public List<ClienteV1> listarV1() {
        // retorna DTO versão 1
    }

    @GetMapping(path = "/{id}", produces = "application/vnd.minhaapi.v1+json")
    public ClienteV1 buscarV1(@PathVariable Long id) {
        // retorna DTO versão 1
    }
}

@RestController
@RequestMapping("/api/clientes")
public class ClienteControllerV2 {

    @GetMapping(produces = "application/vnd.minhaapi.v2+json")
    public List<ClienteV2> listarV2() {
        // retorna DTO versão 2 (talvez com mais campos)
    }

    @GetMapping(path = "/{id}", produces = "application/vnd.minhaapi.v2+json")
    public ClienteV2 buscarV2(@PathVariable Long id) {
        // retorna DTO versão 2
    }
}

```

- **Obs.:** Ambos usam o mesmo path base (`/api/clientes`), mas são diferenciados pelo `produces`, que indica o media type que cada método suporta.
- Ao receber `Accept: application/vnd.minhaapi.v1+json`, o dispatcher localizará o método em `ClienteControllerV1`.
- Se o cliente pedir `application/vnd.minhaapi.v2+json`, invocará o método em `ClienteControllerV2`.

---

### 5.5. Criando Estratégias de Content Negotiation Customizadas

Em cenários mais avançados, pode ser necessário:

- *Negociar não apenas por cabeçalho*, mas também por parâmetros personalizados (ex.: `?api-version=2`).
- *Compor estratégias mistas* (priorizar cabeçalho, fallback em extensão de caminho, etc.).
- *Tratamento de prioridade de media types*.

### 5.5.1. Prioridade de Estratégias

```java
@Override
public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
    configurer
        // 1. Extensão de caminho: ex: /clientes.csv (mas não muito recomendável em APIs REST modernas)
        .favorPathExtension(true)
            .ignoreAcceptHeader(true)   // ignora Accept se extensão estiver presente
        // 2. Parâmetro de URL: ex: /clientes?format=csv
        .favorParameter(true)
            .parameterName("format")
        // 3. Cabeçalho Accept (quando não há extensão nem param)
        .ignoreAcceptHeader(false)
        .defaultContentType(MediaType.APPLICATION_JSON)
        .mediaType("json", MediaType.APPLICATION_JSON)
        .mediaType("xml", MediaType.APPLICATION_XML)
        .mediaType("csv", MediaType.valueOf("text/csv"));
}

```

> Fluxo de decisão:
> 
> 1. Se existir extensão no URL (ex.: `.csv`), usará o media type mapeado para “csv”.
> 2. Senão, se houver `?format=csv`, usará o media type mapeado.
> 3. Senão, se existir `Accept`, usará o que estiver no cabeçalho.
> 4. Caso contrário, retorna JSON.

### 5.5.2. ContentNegotiationStrategy Customizada

Se quisermos criar uma estratégia própria (por exemplo, ler versão via subdomínio ou via URL), precisamos implementar a interface `ContentNegotiationStrategy`. Exemplo: detectar versionamento baseado em subdomínio (`v2.api.meuapp.com`):

```java
public class SubdomainVersioningStrategy implements ContentNegotiationStrategy {

    @Override
    public List<MediaType> resolveMediaTypes(NativeWebRequest webRequest) {
        HttpServletRequest request = webRequest.getNativeRequest(HttpServletRequest.class);
        String host = request.getHeader("Host"); // ex: "v2.api.meuapp.com"
        if (host != null && host.startsWith("v2.")) {
            return Collections.singletonList(CustomMediaType.V2_JSON);
        }
        // fallback: delega para padrão (ex: Accept)
        return Collections.singletonList(MediaType.APPLICATION_JSON);
    }
}

```

Para registrá-la:

```java
@Override
public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
    configurer
        .strategies(
            Arrays.asList(
                new SubdomainVersioningStrategy(),
                new HeaderContentNegotiationStrategy() // padrão de Accept
            )
        );
}

```

> Observação:
> 
> 
> Ao usar `strategies(...)`, você substitui as estratégias internas do Spring por aquelas que listar. Portanto, é preciso incluir também `HeaderContentNegotiationStrategy` e/ou `ParameterContentNegotiationStrategy` caso queira manter comportamentos padrão.
> 

---

### 5.6. Testando o Content Negotiation com MockMvc

Para garantir que tudo está funcionando, utilizamos **MockMvc** no módulo de testes (`spring-boot-starter-test`).

### 5.6.1. Configuração Básica do Teste

```java
@SpringBootTest
@AutoConfigureMockMvc
public class ContentNegotiationTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void deveRetornarJsonPorPadrao() throws Exception {
        mockMvc.perform(get("/api/meus-modelos"))
               .andExpect(status().isOk())
               .andExpect(content().contentType(MediaType.APPLICATION_JSON))
               .andExpect(jsonPath("$[0].id").exists());
    }

    @Test
    public void deveRetornarCsvQuandoSolicitado() throws Exception {
        mockMvc.perform(
                 get("/api/meus-modelos")
                     .accept(MediaType.valueOf("text/csv")))
               .andExpect(status().isOk())
               .andExpect(content().contentType("text/csv"))
               .andExpect(content().string(containsString("id,nome,valor"))); // cabeçalho CSV
    }

    @Test
    public void deveRetornarPdfQuandoSolicitado() throws Exception {
        mockMvc.perform(get("/api/meus-modelos/123")
                    .accept(MediaType.APPLICATION_PDF))
               .andExpect(status().isOk())
               .andExpect(content().contentType(MediaType.APPLICATION_PDF))
               .andExpect(header().exists("Content-Length")); // verifica se tem body
               // Não é trivial checar conteúdo binário, mas valida se o tipo está correto.
    }

    @Test
    public void deveRetornarV1JsonQuandoAcceptV1() throws Exception {
        mockMvc.perform(get("/api/clientes")
                    .accept("application/vnd.minhaapi.v1+json"))
               .andExpect(status().isOk())
               .andExpect(content().contentType("application/vnd.minhaapi.v1+json"))
               .andExpect(jsonPath("$[0].camposDaV1").exists());
    }

    @Test
    public void deveRetornarV2JsonQuandoAcceptV2() throws Exception {
        mockMvc.perform(get("/api/clientes")
                    .accept("application/vnd.minhaapi.v2+json"))
               .andExpect(status().isOk())
               .andExpect(content().contentType("application/vnd.minhaapi.v2+json"))
               .andExpect(jsonPath("$[0].camposDaV2").exists());
    }
}

```

> Pontos de Atenção nos Testes:
> 
> - Use sempre `.accept(...)` para simular cabeçalhos `Accept`.
> - Valide o `contentType(...)` para conferir se o conversor correto foi aplicado.
> - Para CSV, você pode buscar a primeira linha contendo os cabeçalhos.
> - Para PDF, limitar-se a verificar se é `application/pdf`, pois validar binário em teste unitário é complexo.

---

## 6. Cenários de Restrição ou Não Aplicação

1. **Client Fixo a um Formato:**
    
    Se todos os consumidores da API só lidam com JSON e não há planos de suportar outros formatos, configurar Content Negotiation avançado pode ser overkill. Basta manter o conversor JSON padrão e não registrar novos body converters.
    
2. **Performance Altamente Crítica:**
    - Quando há exigências de baixa latência, a criação dinâmica de PDF ou CSV (especialmente PDF com layout complexo) pode degradar performance. Nesses casos, avalie a geração offline e cache de relatórios.
    - Ter muitos conversores pode aumentar o tempo de startup do Spring.
3. **Ambientes Legados ou Restritos:**
    - Se o cliente não envia corretamente cabeçalhos `Accept` (por exemplo, clientes antigos que ignoram esse cabeçalho), pode ser necessário fallback em parâmetros de URL ou extensões — mas se a aplicação já é desenvolvida sem suporte a extensões, adaptar pode ser inviável.
4. **Manutenção e Testabilidade:**
    - Caso haja múltiplos media types muito semelhantes (por exemplo, CSV vs. TSV vs. XLS), a quantidade de conversores customizados pode gerar complexidade no código e nos testes.

---

## 7. Componentes-Chave Associados

| **Componente** | **Descrição / Uso** |
| --- | --- |
| `@Configuration` | Marca classe de configuração do Spring. Utilizada para registrar beans e customizar comportamento de MVC. |
| `WebMvcConfigurer` | Interface que permite customizar o Spring MVC (incluindo configurações de Content Negotiation e Message Converters). |
| `ContentNegotiationConfigurer` | Usado em `WebMvcConfigurer.configureContentNegotiation(...)` para definir quais estratégias (cabeçalho, parâmetro, extensão) devem ser usadas. |
| `ContentNegotiationStrategy` | Interface que define como resolver quais `MediaType`s são aceitáveis para determinada requisição. Pode-se implementar custom strategies (ex.: por subdomínio, versão, etc.). |
| `HttpMessageConverter<T>` | Interface (e classes abstratas, como `AbstractHttpMessageConverter`) que converte entre objetos Java e payload HTTP. |
| `MappingJackson2HttpMessageConverter` | Conversor padrão para JSON (usa Jackson). |
| `Jaxb2RootElementHttpMessageConverter` | Conversor padrão para XML (usa JAXB). |
| `AbstractHttpMessageConverter<T>` | Classe base para criar conversores: facilita lidar com cabeçalhos, checagem de media types, charset, entre outros. |
| `MediaType` | Representa um media type (MIME type) – ex: `MediaType.APPLICATION_JSON`, `MediaType.valueOf("text/csv")`. |
| `@RestController` | Indica classe que expõe endpoints REST. Usualmente combinada com `@RequestMapping` e `@GetMapping(produces = "...")`. |
| `@GetMapping`, `@PostMapping(..., produces="...")` | Definem endpoints e podem especificar o media type de saída (`produces`) e de entrada (`consumes`). |
| `MockMvc` | Classe para testar controllers e filtrar comportamento do DispatcherServlet. Permite configurar requisições simuladas com cabeçalho `Accept`. |
| `MockMvcRequestBuilders.get(...)` | Construtor de requisição para GET. Permite encadear métodos como `.accept(...)` para definir cabeçalhos. |
| `MockMvcResultMatchers.content().contentType(...)` | Permite verificar se o `Content-Type` retornado está conforme esperado. |
| `@Bean` | Quando é necessário expor beans específicos (p.ex.: um `ContentNegotiationManager` customizado), embora muitas vezes só `WebMvcConfigurer` seja suficiente. |

---

## 8. Melhores Práticas e Padrões de Uso

1. **Priorize o Uso de Cabeçalho `Accept`:**
    - A abordagem mais RESTful e interoperável.
    - Evite usar extensão de caminho (`.json`, `.xml`) em APIs públicas, pois pode conflitar com soluções de roteamento e SEO.
2. **Use Tipos de Mídia Customizados para Versionamento:**
    - `application/vnd.suaempresa.v1+json` é mais expressivo que query params para versionar.
    - Revise sempre a convenção de nomes (prefixo `vnd.`, versão numérica e sufixo de formato).
3. **Implemente Conversores Muito Coesos:**
    - Um conversor CSV deve saber apenas como transformar `List<T>` em CSV. Não misture lógica de negócio dentro dele.
    - Caso gere PDF, separe a lógica de layout (geração de tabelas, estilização) em classes auxiliares para facilitar testes.
4. **Teste Automaticamente Todos os Cenários de Negotiation:**
    - Crie testes unitários e de integração cobrindo cada formato suportado.
    - Use `MockMvc` para validar cabeçalhos, status e payload.
5. **Fallback Sensato:**
    - Defina `defaultContentType` (geralmente JSON). Caso o cliente não envie `Accept`, o servidor retorna JSON.
    - Se o cliente pedir um media type não suportado, o Spring retorna HTTP 406 (Not Acceptable). Documente isso na sua documentação de API (Swagger/OpenAPI).
6. **Documente Claramente no OpenAPI/Swagger:**
    - Declare no `@Operation` ou `@ApiResponse` quais `produces` e `consumes` o endpoint aceita.
    - Exiba exemplos de payload para cada media type (e.g., JSON, CSV, PDF) para facilitar o uso por terceiros.
7. **Modularize a Configuração:**
    - Caso haja muitos conversores customizados, crie classes dedicadas para cada grupo (ex.: `CsvConfig`, `PdfConfig`, `VersioningConfig`).
    - Facilita alterar ou remover suporte a um formato sem impactar outros.
8. **Cuidado com Charset e Headers de Cache:**
    - CSV e PDF devem usar UTF-8 sempre que possível para evitar problemas de acentuação.
    - Defina cabeçalhos de cache (`Cache-Control`) adequados se o conteúdo for gerado dinamicamente ou se precisar ser armazenado no cliente.
9. **Monitoramento de Uso:**
    - Se suportar múltiplos formatos, registre métricas que indiquem a frequência de cada formato (ex.: quantas requisições pediram CSV vs JSON). Base para decidir remover ou manter formatos.

---

## 9. Exemplo Prático Completo

A seguir, um projeto simplificado que implementa:

1. Um endpoint GET `/api/produtos` que retorna `List<Produto>` nos formatos JSON, CSV ou PDF, conforme `Accept`.
2. Versionamento de API via cabeçalho (`v1` e `v2`), retornando DTO diferentes.
3. Configuração de negotiation, conversores customizados e testes com MockMvc.

### 9.1. Estrutura de Pacotes (Exemplo)

```
src/
└── main/
    ├── java/
    │   └── com.exemplo.negotiation/
    │       ├── Application.java
    │       ├── config/
    │       │   ├── WebConfig.java
    │       │   ├── CsvMessageConverter.java
    │       │   ├── PdfMessageConverter.java
    │       │   └── CustomMediaType.java
    │       ├── controller/
    │       │   ├── ProdutoControllerV1.java
    │       │   └── ProdutoControllerV2.java
    │       ├── dto/
    │       │   ├── ProdutoV1.java
    │       │   └── ProdutoV2.java
    │       └── model/
    │           └── Produto.java
    └── resources/
        └── application.properties

```

### 9.2. Classe Principal

```java
package com.exemplo.negotiation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

```

### 9.3. Modelo de Domínio

```java
package com.exemplo.negotiation.model;

import java.math.BigDecimal;

public class Produto {
    private Long id;
    private String nome;
    private BigDecimal preco;

    public Produto(Long id, String nome, BigDecimal preco) {
        this.id = id;
        this.nome = nome;
        this.preco = preco;
    }
    // getters e setters omitidos
}

```

### 9.4. DTOs para Versões

```java
// DTO V1: contém id e nome
package com.exemplo.negotiation.dto;

public class ProdutoV1 {
    private Long id;
    private String nome;

    public ProdutoV1(Long id, String nome) {
        this.id = id;
        this.nome = nome;
    }
    // getters e setters
}

// DTO V2: inclui preço
package com.exemplo.negotiation.dto;

import java.math.BigDecimal;

public class ProdutoV2 {
    private Long id;
    private String nome;
    private BigDecimal preco;

    public ProdutoV2(Long id, String nome, BigDecimal preco) {
        this.id = id;
        this.nome = nome;
        this.preco = preco;
    }
    // getters e setters
}

```

### 9.5. Media Types Customizados

```java
package com.exemplo.negotiation.config;

import org.springframework.http.MediaType;

public final class CustomMediaType {
    public static final MediaType VND_API_V1_JSON = MediaType.valueOf("application/vnd.exemplo.v1+json");
    public static final MediaType VND_API_V2_JSON = MediaType.valueOf("application/vnd.exemplo.v2+json");
}

```

### 9.6. WebConfig (Configuração de Content Negotiation e Registro de Conversores)

```java
package com.exemplo.negotiation.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
        configurer
            .favorParameter(false)
            .ignoreAcceptHeader(false)
            .defaultContentType(MediaType.APPLICATION_JSON)
            // Mapeamento de abreviações (não obrigatório)
            .mediaType("json", MediaType.APPLICATION_JSON)
            .mediaType("v1", CustomMediaType.VND_API_V1_JSON)
            .mediaType("v2", CustomMediaType.VND_API_V2_JSON)
            .mediaType("csv", MediaType.valueOf("text/csv"))
            .mediaType("pdf", MediaType.APPLICATION_PDF);
    }

    @Override
    public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
        // Adiciona conversores customizados
        converters.add(new CsvMessageConverter());
        converters.add(new PdfMessageConverter());
    }
}

```

### 9.7. Conversores Customizados

### 9.7.1. `CsvMessageConverter.java`

```java
package com.exemplo.negotiation.config;

import com.exemplo.negotiation.model.Produto;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.MediaType;
import org.springframework.http.converter.AbstractHttpMessageConverter;

import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.nio.charset.StandardCharsets;
import java.util.List;

public class CsvMessageConverter extends AbstractHttpMessageConverter<List<Produto>> {

    public CsvMessageConverter() {
        super(new MediaType("text", "csv", StandardCharsets.UTF_8));
    }

    @Override
    protected boolean supports(Class<?> clazz) {
        return List.class.isAssignableFrom(clazz);
    }

    @Override
    protected List<Produto> readInternal(Class<? extends List<Produto>> clazz, org.springframework.http.HttpInputMessage inputMessage) {
        throw new UnsupportedOperationException("Leitura de CSV não suportada.");
    }

    @Override
    protected void writeInternal(List<Produto> produtos, HttpOutputMessage outputMessage) throws IOException {
        outputMessage.getHeaders().setContentType(new MediaType("text", "csv", StandardCharsets.UTF_8));
        Writer writer = new OutputStreamWriter(outputMessage.getBody(), StandardCharsets.UTF_8);

        try (CSVPrinter csvPrinter = new CSVPrinter(writer,
                CSVFormat.DEFAULT.withHeader("id", "nome", "preco"))) {
            for (Produto produto : produtos) {
                csvPrinter.printRecord(
                    produto.getId(),
                    produto.getNome(),
                    produto.getPreco()
                );
            }
        }
    }
}

```

### 9.7.2. `PdfMessageConverter.java`

```java
package com.exemplo.negotiation.config;

import com.exemplo.negotiation.model.Produto;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.MediaType;
import org.springframework.http.converter.AbstractHttpMessageConverter;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

public class PdfMessageConverter extends AbstractHttpMessageConverter<List<Produto>> {

    public PdfMessageConverter() {
        super(MediaType.APPLICATION_PDF);
    }

    @Override
    protected boolean supports(Class<?> clazz) {
        return List.class.isAssignableFrom(clazz);
    }

    @Override
    protected List<Produto> readInternal(Class<? extends List<Produto>> clazz, org.springframework.http.HttpInputMessage inputMessage) {
        throw new UnsupportedOperationException("Leitura de PDF não suportada.");
    }

    @Override
    protected void writeInternal(List<Produto> produtos, HttpOutputMessage outputMessage) throws IOException {
        outputMessage.getHeaders().setContentType(MediaType.APPLICATION_PDF);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        PdfWriter writer = new PdfWriter(baos);
        com.itextpdf.kernel.pdf.PdfDocument pdfDoc = new com.itextpdf.kernel.pdf.PdfDocument(writer);
        Document document = new Document(pdfDoc);

        document.add(new Paragraph("Lista de Produtos"));
        document.add(new Paragraph(" "));

        for (Produto produto : produtos) {
            document.add(new Paragraph(
                "ID: " + produto.getId() +
                " | Nome: " + produto.getNome() +
                " | Preço: " + produto.getPreco()
            ));
        }

        document.close();
        outputMessage.getBody().write(baos.toByteArray());
    }
}

```

### 9.8. Controllers para Versões

### 9.8.1. `ProdutoControllerV1.java`

```java
package com.exemplo.negotiation.controller;

import com.exemplo.negotiation.config.CustomMediaType;
import com.exemplo.negotiation.dto.ProdutoV1;
import com.exemplo.negotiation.model.Produto;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoControllerV1 {

    // Obter lista fixa para exemplo
    private List<Produto> getProdutos() {
        return Arrays.asList(
            new Produto(1L, "Caneta", new BigDecimal("2.50")),
            new Produto(2L, "Caderno", new BigDecimal("15.00")),
            new Produto(3L, "Mochila", new BigDecimal("120.00"))
        );
    }

    @GetMapping(produces = CustomMediaType.VND_API_V1_JSON_VALUE)
    public List<ProdutoV1> listarV1() {
        return getProdutos().stream()
                .map(p -> new ProdutoV1(p.getId(), p.getNome()))
                .collect(Collectors.toList());
    }

    @GetMapping(produces = "text/csv")
    public List<Produto> listarCsvV1() {
        // Aqui retornamos List<Produto>, pois CsvMessageConverter lida com Produto diretamente
        return getProdutos();
    }

    @GetMapping(produces = MediaType.APPLICATION_PDF_VALUE)
    public List<Produto> listarPdfV1() {
        return getProdutos();
    }
}

```

> Observação:
> 
> - Note que o endpoint `/api/produtos` “genérico” aparece três vezes, mas cada um com `produces` diferente.
> - Para `JSON v1`, convertemos `Produto → ProdutoV1`.
> - Para CSV e PDF, retornamos `List<Produto>` diretamente, pois ambos os conversores (CSV e PDF) saberão como serializar.

### 9.8.2. `ProdutoControllerV2.java`

```java
package com.exemplo.negotiation.controller;

import com.exemplo.negotiation.config.CustomMediaType;
import com.exemplo.negotiation.dto.ProdutoV2;
import com.exemplo.negotiation.model.Produto;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoControllerV2 {

    private List<Produto> getProdutos() {
        return Arrays.asList(
            new Produto(1L, "Caneta", new BigDecimal("2.50")),
            new Produto(2L, "Caderno", new BigDecimal("15.00")),
            new Produto(3L, "Mochila", new BigDecimal("120.00"))
        );
    }

    @GetMapping(produces = CustomMediaType.VND_API_V2_JSON_VALUE)
    public List<ProdutoV2> listarV2() {
        return getProdutos().stream()
                .map(p -> new ProdutoV2(p.getId(), p.getNome(), p.getPreco()))
                .collect(Collectors.toList());
    }

    @GetMapping(produces = "text/csv")
    public List<Produto> listarCsvV2() {
        // Para CSV, não há distinção entre v1 e v2 no modelo (em CSV listamos preço também)
        return getProdutos();
    }

    @GetMapping(produces = MediaType.APPLICATION_PDF_VALUE)
    public List<Produto> listarPdfV2() {
        return getProdutos();
    }
}

```

> Destaques:
> 
> - O mesmo path `/api/produtos` atende a v1 e v2, mas o cabeçalho `Accept` conduz ao controller correto.
> - CSV e PDF não incorporam versão no media type (caso queira versionar CSV/PDF, use `text/vnd.exemplo.v2+csv` etc.).

---

### 9.9. Exemplo de Testes com MockMvc

```java
package com.exemplo.negotiation;

import com.exemplo.negotiation.config.CustomMediaType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// 1. Anotações para teste de integração
@SpringBootTest
@AutoConfigureMockMvc
public class NegotiationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void deveRetornarJsonV1() throws Exception {
        mockMvc.perform(get("/api/produtos")
                    .accept(CustomMediaType.VND_API_V1_JSON_VALUE))
               .andExpect(status().isOk())
               .andExpect(content().contentType(CustomMediaType.VND_API_V1_JSON_VALUE))
               .andExpect(jsonPath("$[0].id").exists())
               .andExpect(jsonPath("$[0].nome").exists());
    }

    @Test
    public void deveRetornarJsonV2() throws Exception {
        mockMvc.perform(get("/api/produtos")
                    .accept(CustomMediaType.VND_API_V2_JSON_VALUE))
               .andExpect(status().isOk())
               .andExpect(content().contentType(CustomMediaType.VND_API_V2_JSON_VALUE))
               .andExpect(jsonPath("$[0].preco").exists());
    }

    @Test
    public void deveRetornarCsv() throws Exception {
        mockMvc.perform(get("/api/produtos")
                    .accept("text/csv"))
               .andExpect(status().isOk())
               .andExpect(content().contentType("text/csv"))
               .andExpect(content().string(containsString("id,nome,preco"))); // cabeçalho CSV
    }

    @Test
    public void deveRetornarPdf() throws Exception {
        mockMvc.perform(get("/api/produtos")
                    .accept(MediaType.APPLICATION_PDF))
               .andExpect(status().isOk())
               .andExpect(content().contentType(MediaType.APPLICATION_PDF));
               // Validar conteúdo binário PDF não é trivial; ao menos confirmamos o tipo
    }
}

```

> Importante:
> 
> - Caso algum teste retorne 406 (Not Acceptable), verifique se `produces` e `Accept` batem exatamente.
> - No caso de múltiplos conversores suportando o mesmo media type (ex.: JSON via Jackson e JSON via outro conversor), o Spring usará a ordem da lista. Cuidado com situações em que há duplicidade.

---

## 10. Sugestões para Aprofundamento

1. **OpenAPI / Swagger + Media Types Customizados**
    - Documentar cada formato via anotações `@Operation` e `@ApiResponse`, explicitando `content.mediaType = "text/csv"` ou `application/pdf`.
    - Exemplo:
        
        ```java
        @Operation(summary = "Lista produtos em CSV",
            responses = {
               @ApiResponse(content = @Content(mediaType = "text/csv", schema = @Schema(type = "string", format = "binary")))
            }
        )
        @GetMapping(path = "/csv", produces = "text/csv")
        public List<Produto> listarCsv() { ... }
        
        ```
        
2. **Cache e ETag em Content Negotiation**
    - Ao gerar recursos grandes (por exemplo, relatórios em PDF), combine com `ETag` e `Cache-Control` para reduzir carga.
    - Exemplo de header `ETag`, retornado pelo conversor ou via `ResponseEntity`:
        
        ```java
        @GetMapping(path = "/pdf", produces = "application/pdf")
        public ResponseEntity<byte[]> baixarPdf() {
            byte[] bytes = service.gerarPdf();
            String eTag = "\"" + DigestUtils.md5DigestAsHex(bytes) + "\"";
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .eTag(eTag)
                .body(bytes);
        }
        
        ```
        
3. **Integração com GraphQL + Content Negotiation**
    - Em ambientes que servem tanto GraphQL (por exemplo, em `/graphql`) quanto REST, use negotiation para diferenciar contexto (ex.: `Accept: application/graphql-response+json`).
4. **Streaming e Reativos (Spring WebFlux)**
    - Em arquitetura reativa, crie conversores que retornem `Flux<T>` e façam stream de CSV/PDF incrementalmente em aplicações com alto volume de dados.
    - Estude como `org.springframework.http.codec.ServerSentEventHttpMessageWriter` faz streaming de eventos.
5. **Segurança e Autorização por Media Type**
    - Em casos avançados, especifique regras de autorização distintas conforme formato (ex.: somente usuários premium podem baixar PDF).
    - Use `@PreAuthorize` ou filtros que inspecionem `Accept` e verifiquem privilégios.
6. **Testes de Integração com Postman/Insomnia**
    - Monte coleções que simulam requisições com diversos cabeçalhos `Accept` e compare resultados.
    - Utilize scripts de teste para validar integridade dos CSV gerados (por exemplo, ver se contêm colunas obrigatórias).

---

### Considerações Finais

Implementar **Content Negotiation Avançado** em Spring Boot torna sua aplicação muito mais flexível e preparada para servir diferentes consumidores (clientes web, relatórios, integrações de sistemas legados etc.). Ao seguir as seções acima, você terá:

- Uma **visão clara** de como o Spring lida com media types por padrão.
- **Ferramentas** para criar conversores para formatos não triviais (CSV, PDF).
- **Padrões** de versionamento (via `Accept`) que preservam URIs e facilitam evolução da API.
- **Estratégias customizadas** para cenários especiais (subdomínio, parâmetros, extensões).
- Um **conjunto de testes** exemplificando como validar cada caminho de negociação.

Ao término, documente tudo (OpenAPI, README do projeto, guias internos) e monitore o uso real de cada formato para evitar acumular conversores não utilizados. Com isso, seu serviço REST estará adequado às melhores práticas de mercado, pronto para crescer sem romper contratos de clientes.