# Fundamentos da Serialização e Desserialização JSON

---

## 1. Introdução

A serialização é o processo de converter um objeto Java em uma representação textual (neste caso, JSON) para transporte ou armazenamento. Já a desserialização é o processo inverso: transformar JSON recebido em instâncias de classes Java. No contexto do Spring Boot, a biblioteca Jackson (incluída via `spring-boot-starter-web`) cuida automaticamente dessa conversão sempre que usamos anotações como `@RestController`, `@RequestBody` e `@ResponseBody`. Entender como o Jackson funciona, suas anotações principais e como configurá-lo é crucial para garantir que sua aplicação exponha e consuma APIs REST de maneira correta, eficiente e segura.

---

## 2. Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conceitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    1. Configuração padrão no Spring Boot
    2. Anotações de Serialização/Desserialização
    3. Customizações comuns (formatos de data, naming strategies)
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
    1. `ObjectMapper`
    2. `JsonSerializer` e `JsonDeserializer`
    3. Anotações principais: `@JsonProperty`, `@JsonIgnore`, etc.
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## 3. Conceitos Fundamentais

- **Serialização (Java → JSON):**
    - Transformar instâncias de classes Java em texto JSON.
    - Garante interoperabilidade entre serviços (por exemplo, frontend em JavaScript e backend em Java).
    - Exemplos: converter um objeto `Pessoa { nome: "Ana", idade: 30 }` em `{"nome":"Ana","idade":30}`.
- **Desserialização (JSON → Java):**
    - Ação oposta: receber JSON (por exemplo, via HTTP POST) e construir objetos Java correspondentes.
    - Mapeamento de campos JSON para atributos de classe.
- **Jackson como Biblioteca Padrão do Spring Boot:**
    - O `spring-boot-starter-web` traz, como dependência transitiva, o Jackson (pacote `com.fasterxml.jackson.core`).
    - O Spring cria, automaticamente, um bean `ObjectMapper` configurado com sensible defaults (como tolerância a propriedades desconhecidas e naming strategy padrão “camelo”).
    - Sempre que um método em um `@RestController` retorna um objeto Java (ou recebe via `@RequestBody`), o Jackson faz a conversão JSON ↔️ Java sem necessidade de configuração extra.
- **Dependência Chave:**
    
    ```xml
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    ```
    
    - Isso inclui Jackson, Spring MVC, Tomcat (ou outro contêiner embutido) e configurações padrão para trabalhar com JSON.

---

## 4. Sintaxe Detalhada e Uso Prático

### 4.1. Configuração Padrão no Spring Boot

- **Auto-configuração:**
    1. Ao incluir `spring-boot-starter-web`, o Spring Boot registra um bean `MappingJackson2HttpMessageConverter`.
    2. Esse conversor usa um `ObjectMapper` embutido (com configurações básicas: ignora propriedades desconhecidas, converte nomes de propriedades JSON em camelCase, etc.).
    3. Basta anotar controladores da seguinte forma para receber/enviar JSON automaticamente:
        
        ```java
        @RestController
        @RequestMapping("/api/pessoas")
        public class PessoaController {
        
            // Serialização: retorna JSON para o cliente
            @GetMapping("/{id}")
            public Pessoa buscarPorId(@PathVariable Long id) {
                return pessoaService.buscarPorId(id);
            }
        
            // Desserialização: converte JSON recebido em objeto Java
            @PostMapping
            public ResponseEntity<Pessoa> criar(@RequestBody Pessoa novaPessoa) {
                Pessoa criada = pessoaService.salvar(novaPessoa);
                return ResponseEntity.status(HttpStatus.CREATED).body(criada);
            }
        }
        
        ```
        
    4. **Sem necessidade de novas configurações**. Caso queira alterar comportamento global (por exemplo, formato de data), pode injetar/configurar o próprio `ObjectMapper` ou criar um bean customizado.

### 4.2. Exemplo de Classe Simples

- Suponha a classe:
    
    ```java
    public class Pessoa {
        private Long id;
        private String nome;
        private int idade;
    
        // Construtores, getters e setters
    }
    
    ```
    
- **Requisição POST JSON (Desserialização):**
    
    ```json
    {
      "nome": "Carlos",
      "idade": 25
    }
    
    ```
    
    → Jackson cria `new Pessoa(null, "Carlos", 25)` (o `id` virá `null` ou default).
    
- **Resposta GET JSON (Serialização):**
    
    O retorno `new Pessoa(1L, "Carlos", 25)` será convertido em:
    
    ```json
    {
      "id": 1,
      "nome": "Carlos",
      "idade": 25
    }
    
    ```
    

### 4.3. Anotações de Serialização/Desserialização

1. **`@JsonProperty("nome_json")`**
    - Mapeia um nome de campo JSON diferente do nome de atributo Java.
    - Exemplo:
        
        ```java
        public class Usuario {
            @JsonProperty("user_name")
            private String username;
            // ...
        }
        
        ```
        
    - Se JSON vier com `"user_name": "joao"`, Jackson popula `username = "joao"`.
2. **`@JsonIgnore`**
    - Ignora um campo: nem serializa nem desserializa.
    - Exemplo:
        
        ```java
        public class Conta {
            private String numero;
            @JsonIgnore
            private String senha;
            // ...
        }
        
        ```
        
    - `senha` não aparecerá no JSON de saída e, se o JSON de entrada tiver `"senha": "123"`, Jackson descarta.
3. **`@JsonIgnoreProperties`** (nível de classe)
    - Ignora múltiplas propriedades (útil para evitar exceções de “propriedade desconhecida”).
    - Exemplo:
        
        ```java
        @JsonIgnoreProperties(ignoreUnknown = true)
        public class Endereco {
            private String logradouro;
            private String cidade;
            // ...
        }
        
        ```
        
    - Se chegar JSON com `{"logradouro":"Av A", "cidade":"X", "cep":"00000-000"}`, o campo `"cep"` é simplesmente ignorado.
4. **`@JsonInclude(Include.NON_NULL)`**
    - Controla quais atributos aparecem: por exemplo, só incluir no JSON aqueles que não são `null`.
    - Exemplo:
        
        ```java
        @JsonInclude(JsonInclude.Include.NON_NULL)
        public class Produto {
            private Long id;
            private String nome;
            private String descricao; // se for null, não aparece no JSON
            // ...
        }
        
        ```
        
5. **`@JsonFormat`** (datas e horas)
    - Formatar `LocalDate`, `LocalDateTime`, `Date` conforme padrão desejado.
    - Exemplo:
        
        ```java
        public class Evento {
            @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
            private LocalDateTime dataHora;
            // ...
        }
        
        ```
        
    - Com isso, `dataHora = LocalDateTime.of(2025,6,5,14,30)` vira `"2025-06-05 14:30:00"` no JSON.

### 4.4. Customizações Comuns

- **Naming Strategy** (camelCase ↔ snake_case, etc.)
    - Por padrão, Jackson usa camelCase (por exemplo, atributo `dataCadastro` → JSON `"dataCadastro"`).
    - Para usar snake_case globalmente:
        
        ```java
        @Configuration
        public class JacksonConfig {
            @Bean
            public Jackson2ObjectMapperBuilderCustomizer jacksonCustomizer() {
                return builder ->
                    builder.propertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
            }
        }
        
        ```
        
    - Agora, `dataCadastro` vira `"data_cadastro"` e vice-versa.
- **Serializadores/Desserializadores Customizados**
    - Quando precisamos de lógica complexa (por exemplo, converter um valor “foto” em Base64).
    - Exemplo de serializador:
        
        ```java
        public class Base64ImageSerializer extends StdSerializer<byte[]> {
            public Base64ImageSerializer() { super(byte[].class); }
        
            @Override
            public void serialize(byte[] value, JsonGenerator gen, SerializerProvider provider)
                    throws IOException {
                String base64 = Base64.getEncoder().encodeToString(value);
                gen.writeString(base64);
            }
        }
        
        ```
        
    - E registrá-lo em uma classe:
        
        ```java
        public class Imagem {
            @JsonSerialize(using = Base64ImageSerializer.class)
            private byte[] conteudo;
            // ...
        }
        
        ```
        
- **Filtros Dinâmicos**
    - Permitem incluir/excluir campos em tempo de execução (ex.: views privadas ou públicas).
    - Utilizam `@JsonFilter` e `FilterProvider` no `ObjectMapper`.

---

## 5. Cenários de Restrição ou Não Aplicação

1. **XML ao invés de JSON:**
    - Se a sua API precisar expor XML, o Jackson (com o módulo `jackson-dataformat-xml`) funciona, mas normalmente em aplicações REST modernas prefere-se JSON. Se XML for prioridade, pode-se usar JAXB ou outras soluções especializadas.
2. **Formatos Proprietários (por exemplo, BSON, YAML):**
    - Jackson suporta módulos adicionais (`jackson-dataformat-yaml`, `jackson-dataformat-bson`), mas configurações específicas são necessárias. Não serve de “drop-in” diretamente sem adicionar dependências.
3. **Objetos Muito Complexos (Ciclos de Referências):**
    - Caso haja relações recursivas (por exemplo, `A → B → A`), Jackson pode entrar em loop de serialização. É necessário usar anotações como `@JsonManagedReference` e `@JsonBackReference` ou `@JsonIdentityInfo` para evitar recursão infinita.
4. **Alto Desempenho com Payloads Gigantes:**
    - Jackson é bastante rápido, mas para cenários de altíssimo throughput pode-se considerar alternativas como **Gson**, **Jsoniter** ou bibliotecas específicas de streaming que operam em modo “pull” ou “push”. Ainda assim, Jackson costuma ser o mais usado por integração nativa com Spring.

---

## 6. Componentes Chave Associados

### 6.1. `ObjectMapper`

- **Classe principal do Jackson** responsável por serializar e desserializar.
- Pode ser configurado globalmente, injetado em serviços ou instanciado manualmente:
    
    ```java
    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.enable(SerializationFeature.INDENT_OUTPUT); // Ex.: formatar JSON com indentação
    
    ```
    
- No Spring Boot, define-se customizações por meio de um bean ou do `Jackson2ObjectMapperBuilderCustomizer`.

### 6.2. `JsonSerializer` e `JsonDeserializer`

- **`JsonSerializer<T>`**: base para criar serializadores customizados.
    - Implementar método `void serialize(T value, JsonGenerator gen, SerializerProvider serializers)`.
- **`JsonDeserializer<T>`**: base para criar desserializadores customizados.
    - Implementar método `T deserialize(JsonParser p, DeserializationContext ctxt)`.
- Registram-se com anotações `@JsonSerialize(using = ...)` ou `@JsonDeserialize(using = ...)`, ou globalmente via módulo Jackson.

### 6.3. Anotações Principais

- **`@JsonProperty`**: mapeia nome JSON ↔ campo Java.
- **`@JsonIgnore` / `@JsonIgnoreProperties`**: ignora atributos.
- **`@JsonInclude`**: define critérios de inclusão (por exemplo, incluir apenas se não for `null`).
- **`@JsonFormat`**: formata datas, horas, números.
- **`@JsonManagedReference` / `@JsonBackReference`**: evita ciclos em relações bidirecionais (ex.: JPA `@OneToMany` e `@ManyToOne`).
- **`@JsonIdentityInfo`**: outra abordagem para referência de objetos (utiliza IDs em vez de anotações de “managed/back”).

---

## 7. Melhores Práticas e Padrões de Uso

1. **Evite Campos Desnecessários no JSON de Resposta**
    - Use `@JsonIgnore` ou `@JsonInclude(Include.NON_NULL)` para não expor dados sensíveis ou irrelevantes.
2. **Controle de Versões de APIs**
    - Se precisar de compatibilidade retroativa, crie classes DTO (Data Transfer Objects) específicas para cada versão da API.
    - Nunca altere diretamente entidades JPA mapeadas para o banco para evitar quebra de contratos.
3. **Valide Dados Recebidos no `@RequestBody`**
    - Combine Jackson com Bean Validation (`@Valid`) para garantir que JSON recebido respeite restrições (ex.: `@NotNull`, `@Size`).
    - Exemplo:
        
        ```java
        public class PessoaInput {
            @NotBlank
            private String nome;
        
            @Min(0) @Max(150)
            private Integer idade;
            // getters/setters
        }
        
        @PostMapping
        public ResponseEntity<Pessoa> criar(@Valid @RequestBody PessoaInput input) { ... }
        
        ```
        
    - Assim, se faltar `nome` ou `idade` for inválido, a aplicação responderá com 400 Bad Request automaticamente.
4. **Tratamento de Erros de Desserialização**
    - Por padrão, se Jackson receber um campo JSON que não existe na classe, ocorre `UnrecognizedPropertyException`.
    - Use `@JsonIgnoreProperties(ignoreUnknown = true)` ou configure `objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)` para ignorar extras.
5. **Padronize Convenções de Nomes**
    - Determine se sua API usará `camelCase` ou `snake_case` e configure o `PropertyNamingStrategy` de forma global. Evita inconsistências entre endpoints e documentação.
6. **Proteja Campos Sensíveis**
    - Não envie senhas, tokens ou informações restritas direto em JSON de saída.
    - Use view models ou DTOs específicos para resposta e anote campos confidenciais com `@JsonIgnore`.
7. **Performance**
    - Para payloads grandes, considere usar streaming (JsonGenerator / JsonParser) ou anotações `@JsonSerialize(using = ToStringSerializer.class)` para tipos especiais (por ex., BigDecimal).
    - Desabilite formatação “pretty-print” (indentação) em produção para economizar banda.

---

## 8. Exemplo Prático Completo

Imagine um microserviço simples que gerencia “Tarefas” (`Task`).

1. **Dependência no `pom.xml`:**
    
    ```xml
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    ```
    
2. **Entidade/DTO:**
    
    ```java
    import com.fasterxml.jackson.annotation.JsonFormat;
    import com.fasterxml.jackson.annotation.JsonIgnore;
    import com.fasterxml.jackson.annotation.JsonInclude;
    import com.fasterxml.jackson.annotation.JsonProperty;
    
    import java.time.LocalDateTime;
    
    @JsonInclude(JsonInclude.Include.NON_NULL) // não envia campos nulos
    public class TaskDTO {
        private Long id;
    
        @JsonProperty("titulo") // nome customizado no JSON
        private String title;
    
        private String descricao;
    
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime dataCriacao;
    
        @JsonIgnore // nunca mostrar este campo no JSON
        private String secretKey;
    
        // Construtores
        public TaskDTO() {}
    
        public TaskDTO(Long id, String title, String descricao, LocalDateTime dataCriacao, String secretKey) {
            this.id = id;
            this.title = title;
            this.descricao = descricao;
            this.dataCriacao = dataCriacao;
            this.secretKey = secretKey;
        }
    
        // Getters e Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
    
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
    
        public String getDescricao() { return descricao; }
        public void setDescricao(String descricao) { this.descricao = descricao; }
    
        public LocalDateTime getDataCriacao() { return dataCriacao; }
        public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }
    
        public String getSecretKey() { return secretKey; }
        public void setSecretKey(String secretKey) { this.secretKey = secretKey; }
    }
    
    ```
    
3. **Controller:**
    
    ```java
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;
    
    import javax.validation.Valid;
    import java.time.LocalDateTime;
    import java.util.ArrayList;
    import java.util.List;
    import java.util.concurrent.atomic.AtomicLong;
    
    @RestController
    @RequestMapping("/api/tasks")
    public class TaskController {
    
        private final List<TaskDTO> banco = new ArrayList<>();
        private final AtomicLong idGenerator = new AtomicLong(1);
    
        // Endpoint para criar nova tarefa (desserialização automática)
        @PostMapping
        public ResponseEntity<TaskDTO> criar(@Valid @RequestBody TaskDTO tarefaRecebida) {
            Long novoId = idGenerator.getAndIncrement();
            tarefaRecebida.setId(novoId);
            tarefaRecebida.setDataCriacao(LocalDateTime.now());
            tarefaRecebida.setSecretKey("chave-secreta-" + novoId); // não será exibido no JSON
            banco.add(tarefaRecebida);
            return ResponseEntity.status(HttpStatus.CREATED).body(tarefaRecebida);
        }
    
        // Endpoint para listar todas as tarefas (serialização automática)
        @GetMapping
        public List<TaskDTO> listar() {
            return banco;
        }
    
        // Exemplo de desserializar JSON parcialmente: omitir “descricao”
        @PostMapping("/semDescricao")
        public ResponseEntity<TaskDTO> criarSemDescricao(@RequestBody TaskDTO tarefa) {
            tarefa.setId(idGenerator.getAndIncrement());
            tarefa.setDataCriacao(LocalDateTime.now());
            banco.add(tarefa);
            return ResponseEntity.status(HttpStatus.CREATED).body(tarefa);
        }
    }
    
    ```
    
4. **Como o Jackson Age nos Casos Acima:**
    - **Criação (POST `/api/tasks`):**
        - O JSON enviado:
            
            ```json
            {
              "titulo": "Comprar pão",
              "descricao": "Ir ao supermercado e comprar pão francês"
            }
            
            ```
            
        - Jackson faz:
            1. Mapeia `"titulo"` em `title` (por causa de `@JsonProperty("titulo")`).
            2. Preenche `descricao`.
            3. Deixa `id` e `dataCriacao` como `null` no momento da desserialização.
            4. Ignora campos extras (caso chegue algum campo não mapeado), desde que não se tenha rigidamente configurado para reprovar.
        - O controller, em seguida, popula `id`, `dataCriacao` e `secretKey`.
        - Ao retornar, Jackson converte o objeto em JSON. O campo `secretKey` é ignorado (por `@JsonIgnore`) e, se algum campo for `null` (por exemplo, `descricao` no segundo endpoint), ele não aparece no JSON (por `@JsonInclude(Include.NON_NULL)`).
    - **Listagem (GET `/api/tasks`):**
        - O método retorna `List<TaskDTO>`. Jackson itera sobre a lista e serializa cada objeto, respeitando anotações.
        - Se a lista tiver duas tarefas, o JSON de resposta é:
            
            ```json
            [
              {
                "id": 1,
                "titulo": "Comprar pão",
                "descricao": "Ir ao supermercado e comprar pão francês",
                "dataCriacao": "2025-06-05 22:14:30"
              },
              {
                "id": 2,
                "titulo": "Enviar e-mail",
                "dataCriacao": "2025-06-05 22:15:10"
              }
            ]
            
            ```
            
        - Note que o segundo objeto não possui `descricao` (estava `null`) e nem `secretKey`.

---

## 9. Sugestões para Aprofundamento

- **Documentação Oficial do Jackson:**
    - Seções de serialização e desserialização:
        
        [https://github.com/FasterXML/jackson-docs](https://github.com/FasterXML/jackson-docs)
        
- **Livro “Spring Boot in Action” (Craig Walls):**
    - Capítulo sobre Web e Jackson — aborda configurações avançadas e customizadas.
- **Guia Spring: Building a RESTful Web Service**
    - Demonstram desde o básico até configurações mais complexas (manipulação de erros, validação, formatação de datas):
        
        [https://spring.io/guides/gs/rest-service/](https://spring.io/guides/gs/rest-service/)
        
- **Artigos sobre Jackson Modules:**
    - Jackson Kotlin Module, Jackson Joda Module, Jackson JavaTime Module (para `LocalDate/LocalDateTime`).
- **Tópicos Avançados para Estudar Depois:**
    1. *JsonView*: gerar “visões” diferentes do mesmo objeto para clientes diferentes.
    2. *Filtros Dinâmicos*: incluir/excluir campos em runtime conforme contexto.
    3. Integração Jackson + Kotlin (quando for usar Spring Boot com Kotlin).
    4. Streaming de dados (`JsonParser` e `JsonGenerator`) para alta performance.

---

**Observação:**

Este conteúdo cobre desde o entendimento conceitual até exemplos práticos de uso no Spring Boot. Caso você utilize entidades JPA diretamente com JSON, preste atenção em ciclos de referências. Para casos avançados, avalie criar DTOs especificamente para evitar expor campos indesejados.