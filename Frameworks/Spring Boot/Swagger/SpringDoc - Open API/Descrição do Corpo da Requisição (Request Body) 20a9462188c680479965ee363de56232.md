# Descrição do Corpo da Requisição (Request Body)

---

## 1. Introdução

O Swagger (agora parte do ecossistema OpenAPI) torna mais simples produzir documentação interativa de APIs RESTful. No contexto do Spring Boot, o **SpringDoc** é uma implementação que gera automaticamente a especificação OpenAPI 3.0 com base nos seus **controllers**, **DTOs** e **anotações**.

Nesta explicação, focaremos especialmente em como descrever o **Request Body** (corpo da requisição) usando anotações do Swagger/OpenAPI no SpringDoc. Veremos desde conceitos fundamentais até exemplos de código completos, de modo a garantir que sua API exiba, na interface Swagger UI, informações claras sobre quais campos devem ser enviados pelo cliente, quais são obrigatórios, exemplos de payload, esquemas de validação etc.

---

## 2. Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conceitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    1. Definindo DTOs com anotações `@Schema`
    2. Anotando o endpoint com `@io.swagger.v3.oas.annotations.parameters.RequestBody`
    3. Variações de sintaxe (exemplos, obrigatoriedade, múltiplos esquemas)
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
    1. `@Schema`, `@ExampleObject` e `@Content`
    2. `io.swagger.v3.oas.annotations.parameters.RequestBody` (Swagger) vs `org.springframework.web.bind.annotation.RequestBody` (Spring MVC)
    3. Propriedades de configuração no `application.properties`/`application.yml`
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## 3. Conceitos Fundamentais

1. **OpenAPI / Swagger**
    - É uma especificação de metadados que descreve APIs REST de forma padronizada.
    - Permite gerar automaticamente documentação interativa (Swagger UI) e clientes em diversas linguagens.
2. **SpringDoc (springdoc-openapi)**
    - Projeto que inspeciona controllers Spring Boot e anotações OpenAPI (v3) para gerar JSON/YAML da especificação sem configuração manual extensa.
    - Integra-se ao Spring Boot e expõe, por padrão, as URLs `/v3/api-docs` (JSON) e `/swagger-ui.html` (UI interativa).
3. **Request Body (Corpo da Requisição)**
    - Em endpoints HTTP (normalmente POST, PUT, PATCH), os dados enviados pelo cliente ficam no “body” (payload).
    - Documentar o Request Body é essencial para que consumidores saibam quais campos enviar, seus tipos, exemplos e requisitos de validação.
4. **Diferença entre Anotação Spring MVC e Anotação Swagger**
    - **`@org.springframework.web.bind.annotation.RequestBody`**: Instrui o Spring a fazer *binding* (desserializar) o JSON/XML recebido em um objeto Java (DTO).
    - **`@io.swagger.v3.oas.annotations.parameters.RequestBody`**: Informa ao SpringDoc como documentar esse corpo no OpenAPI (descrição, exemplos, `required`, esquema de validação etc.).
    - Normalmente, usa-se ambas em conjunto: o Spring MVC faz o *binding* em tempo de execução e o Swagger faz o *binding* apenas para gerar documentação interativa.

---

## 4. Sintaxe Detalhada e Uso Prático

### 4.1 Definindo DTOs com anotações `@Schema`

Para que o SpringDoc gere corretamente o esquema (schema) do corpo da requisição, definimos classes Java (DTOs) que representem o JSON esperado. Em cada campo, podemos usar a anotação `@Schema` (do pacote `io.swagger.v3.oas.annotations.media.Schema`) para detalhar:

- `description` (descrição do campo).
- `example` (exemplo de valor).
- `required` (se é obrigatório).
- `defaultValue` (valor padrão, se aplicável).
- `format` / `pattern` (expressão regular para validação).

> Exemplo de DTO:
> 
> 
> ```java
> package com.exemplo.api.dto;
> 
> import io.swagger.v3.oas.annotations.media.Schema;
> import javax.validation.constraints.NotBlank;
> import javax.validation.constraints.NotNull;
> 
> @Schema(name = "ProdutoRequest", description = "Dados necessários para criar ou atualizar um produto")
> public class ProdutoRequest {
> 
>     @Schema(description = "Nome do produto",
>             example = "Teclado Mecânico",
>             required = true)
>     @NotBlank(message = "O nome é obrigatório")
>     private String nome;
> 
>     @Schema(description = "Descrição detalhada do produto",
>             example = "Teclado mecânico RGB, switch Brown")
>     private String descricao;
> 
>     @Schema(description = "Preço unitário do produto em reais",
>             example = "249.90",
>             format = "double",
>             required = true)
>     @NotNull(message = "O preço é obrigatório")
>     private Double preco;
> 
>     // getters e setters omitidos para brevidade
> }
> 
> ```
> 

> Comentário
> 
> - A camada de validação (`@NotBlank`, `@NotNull`) garante que, em tempo de execução, o Spring valide o payload.
> - O `@Schema` associa metadados ao OpenAPI, exibindo descrições e exemplos na interface Swagger UI.
> - O `name = "ProdutoRequest"` define como esse objeto aparecerá em “Schemas” no Swagger UI.

---

### 4.2 Anotando o Endpoint com `@io.swagger.v3.oas.annotations.parameters.RequestBody`

No controller, para cada método que receba um corpo, fazemos:

1. Anotar com `@PostMapping`, `@PutMapping` etc., usando `@RequestBody` (Spring MVC) para que o JSON seja desserializado.
2. Adicionar `@io.swagger.v3.oas.annotations.Operation(...)` para descrever a operação inteira (título, descrição, tags, respostas).
3. Dentro de `@Operation`, usar `@io.swagger.v3.oas.annotations.parameters.RequestBody(...)` (Swagger) para detalhar o corpo:
    - `description`: texto livre explicando o objetivo do payload.
    - `required`: se o corpo é obrigatório (verdadeiro/falso).
    - `content`: matriz de `@Content(mediaType = "application/json", schema = @Schema(implementation = ProdutoRequest.class), examples = @ExampleObject(...))`.

> Exemplo de controller:
> 
> 
> ```java
> package com.exemplo.api.controller;
> 
> import com.exemplo.api.dto.ProdutoRequest;
> import com.exemplo.api.dto.ProdutoResponse;
> import io.swagger.v3.oas.annotations.Operation;
> import io.swagger.v3.oas.annotations.media.Content;
> import io.swagger.v3.oas.annotations.media.ExampleObject;
> import io.swagger.v3.oas.annotations.media.Schema;
> import io.swagger.v3.oas.annotations.parameters.RequestBody;
> import io.swagger.v3.oas.annotations.responses.ApiResponse;
> import io.swagger.v3.oas.annotations.tags.Tag;
> import org.springframework.http.ResponseEntity;
> import org.springframework.validation.annotation.Validated;
> import org.springframework.web.bind.annotation.*;
> 
> @RestController
> @RequestMapping("/api/produtos")
> @Tag(name = "Produtos", description = "Operações relacionadas a produtos")
> public class ProdutoController {
> 
>     @Operation(
>         summary = "Cria um novo produto",
>         description = "Este endpoint cria um novo produto e retorna seus dados com ID gerado",
>         requestBody = @RequestBody(
>             description = "Dados do produto a ser criado",
>             required = true,
>             content = @Content(
>                 mediaType = "application/json",
>                 schema = @Schema(implementation = ProdutoRequest.class),
>                 examples = @ExampleObject(
>                     name = "ExemploCriacao",
>                     description = "Exemplo de payload para criar um produto",
>                     value = "{ \"nome\": \"Mouse Gamer\", \"descricao\": \"Mouse com DPI ajustável\", \"preco\": 129.90 }"
>                 )
>             )
>         ),
>         responses = {
>             @ApiResponse(responseCode = "201", description = "Produto criado com sucesso",
>                 content = @Content(mediaType = "application/json",
>                     schema = @Schema(implementation = ProdutoResponse.class))
>             ),
>             @ApiResponse(responseCode = "400", description = "Requisição inválida")
>         }
>     )
>     @PostMapping
>     public ResponseEntity<ProdutoResponse> criarProduto(
>             @Validated @org.springframework.web.bind.annotation.RequestBody ProdutoRequest dto) {
>         // Lógica de criação omitida
>         ProdutoResponse response = new ProdutoResponse(/* parâmetros omitidos */);
>         return ResponseEntity.status(201).body(response);
>     }
> }
> 
> ```
> 

> Comentário
> 
> - `@Operation` encapsula toda a documentação do endpoint.
> - O `requestBody` dentro de `@Operation` não confunde com o `@RequestBody` do SpringMVC. Aqui, ele serve apenas para documentar.
> - O atributo `examples` dentro de `@Content` exibe um exemplo JSON diretamente no Swagger UI para facilitar o entendimento do consumidor.
> - Se o campo `required = true`, a UI indicará claramente que o corpo não pode ficar vazio.

---

### 4.3 Variações de Sintaxe

### 4.3.1 Múltiplos Exemplos

Se quiser oferecer diferentes exemplos (por cenários, por versões ou por tipos de payload), use um array de `@ExampleObject`:

```java
@RequestBody(
    description = "Dados do produto",
    required = true,
    content = @Content(
        mediaType = "application/json",
        schema = @Schema(implementation = ProdutoRequest.class),
        examples = {
            @ExampleObject(
                name = "ExemploPadrão",
                value = "{ \"nome\": \"Teclado Mecânico\", \"descricao\": \"Switch Blue\", \"preco\": 299.90 }"
            ),
            @ExampleObject(
                name = "ExemploSemDescricao",
                value = "{ \"nome\": \"Mouse Sem Fio\", \"preco\": 79.90 }"
            )
        }
    )
)

```

### 4.3.2 Corpo Genérico (Polimórfico)

Quando você possui vários tipos possíveis de payload (por exemplo, cadastro de usuário que pode ser Pessoa Física ou Jurídica), pode usar `oneOf`, `anyOf` ou `allOf`:

```java
@RequestBody(
    description = "Dados de cadastro (PF ou PJ)",
    required = true,
    content = @Content(
        mediaType = "application/json",
        schema = @Schema(
            oneOf = { PessoaFisicaRequest.class, PessoaJuridicaRequest.class }
        )
    )
)

```

Nesse caso, o Swagger UI exibirá ambas as opções de esquema, e o consumidor entenderá que pode enviar qualquer um dos dois objetos.

### 4.3.3 Objetos Embutidos (Nested Schemas)

Se o DTO contém outros objetos (por exemplo, endereço dentro de pessoa), basta anotar cada classe aninhada:

```java
@Schema(name = "EnderecoRequest", description = "Dados de endereço")
public class EnderecoRequest {
    @Schema(description = "Logradouro", example = "Rua das Flores, 123")
    private String logradouro;
    // ...
}

@Schema(name = "PessoaRequest")
public class PessoaRequest {
    @Schema(description = "Nome completo", example = "Ana Silva", required = true)
    private String nome;

    @Schema(description = "Endereço completo")
    private EnderecoRequest endereco;
    // ...
}

```

E no controller:

```java
@Operation(
    summary = "Cria uma pessoa com endereço",
    requestBody = @RequestBody(
        description = "Dados da pessoa e endereço",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = PessoaRequest.class)
        )
    ),
    // ...
)
@PostMapping("/pessoas")
public ResponseEntity<PessoaResponse> criarPessoa(
        @Validated @RequestBody PessoaRequest dto) { ... }

```

---

## 5. Cenários de Restrição ou Não Aplicação

1. **Endpoints HTTP GET, DELETE ou HEAD**
    - Por convenção, GET e DELETE não devem ter Request Body; se incluído, muitos clientes e proxies podem ignorá-lo ou rejeitá-lo. Logo, documentar Request Body nesses verbos é incomum e pode não ser suportado.
2. **Payloads Muito Grandes ou Binários**
    - Quando o corpo é um *stream* de bytes (upload de arquivo gigante, streaming de mídia), a especificação OpenAPI pode documentar via `@Parameter(in = ParameterIn.DEFAULT, content = @Content(mediaType = "application/octet-stream"))`, mas não suporte tantos detalhes de JSON.
3. **APIs Internas Estritamente Controladas**
    - Se a API for estritamente interna, com consumo apenas por código Java controlado, a documentação OpenAPI pode ser menos fundamental — mas ainda assim recomendável para manutenção e testes (Swagger UI facilita muito).
4. **Esquemas Extremamente Dinâmicos (sem DTOs fixos)**
    - Aplicações que recebem JSON genérico (por exemplo, `Map<String, Object>`) não teriam representação clara em DTOs; nesse caso, seria necessário usar `schema = @Schema(type = "object", additionalProperties = @Schema(type = "object"))`, mas perde-se a precisão da documentação de cada campo.

---

## 6. Componentes Chave Associados

### 6.1 Anotações de Modelagem no DTO

- **`@Schema`** (pacote `io.swagger.v3.oas.annotations.media.Schema`):
    - `implementation`: vincula a classe ao schema.
    - `name`: nome do modelo que aparecerá no Swagger UI.
    - `description`: texto explicativo sobre o modelo.
    - Atributos de cada campo (dentro da própria classe) permitem detalhar tipo, formato (p.ex., `format="date-time"`), enumerações etc.
- **`@ExampleObject`** (pacote `io.swagger.v3.oas.annotations.media.ExampleObject`):
    - Usado em conjunto com `@Content` para fornecer exemplos JSON.
    - Atributos principais: `name`, `summary`, `description` e `value` (JSON bruto).
- **Validações JSR-303 (`@NotNull`, `@Size`, `@Pattern` etc.)**:
    - Embora não façam parte direta do Swagger, o SpringDoc inspeciona as anotações de validação para inferir `required`, `minLength`, `maxLength`, `pattern` etc.

### 6.2 Anotações de Documentação no Controller

- **`@Operation`** (pacote `io.swagger.v3.oas.annotations.Operation`):
    - `summary`, `description`: textos que aparecem no Swagger UI.
    - `tags`: categorização de endpoints.
    - `parameters`: para documentar parâmetros de query, path, header.
    - `requestBody`: para documentar corpo de requisição.
    - `responses`: array de `@ApiResponse`, detalhando cada código HTTP e seu `content`.
- **`@io.swagger.v3.oas.annotations.parameters.RequestBody`** (Swagger)
    - `description`: texto sobre o payload.
    - `required`: boolean.
    - `content`: array de `@Content`, onde cada `@Content` declara `mediaType`, `schema` e opcionalmente `examples`.
- **`@ApiResponse`** (pacote `io.swagger.v3.oas.annotations.responses.ApiResponse`):
    - Documenta as respostas. Muitas vezes, incluímos um `content = @Content(schema = @Schema(implementation = AlgoResponse.class))` para indicar o modelo de resposta.
- **`@Parameter`** (pacote `io.swagger.v3.oas.annotations.Parameter`):
    - Para descrever parâmetros de rota (`in = ParameterIn.PATH`), query (`in = ParameterIn.QUERY`), header etc. Não se usa para corpo; para corpo usa-se `@RequestBody`.

### 6.3 Propriedades de Configuração no `application.properties` / `application.yml`

- **Ativar o SpringDoc** (geralmente não é necessário, pois a dependência já habilita por padrão):
    
    ```
    springdoc.api-docs.enabled=true
    springdoc.swagger-ui.enabled=true
    
    ```
    
- **Alterar título, versão, informações gerais** (via `@OpenAPIDefinition` ou `application.yml`):
    
    ```java
    @OpenAPIDefinition(
      info = @Info(
        title = "API de Produtos",
        version = "1.0.0",
        description = "Documentação da API de gerenciamento de produtos"
      )
    )
    @SpringBootApplication
    public class ApiApplication { ... }
    
    ```
    
    Ou via `application.yml`:
    
    ```yaml
    springdoc:
      api-docs:
        path: /v3/api-docs
      swagger-ui:
        path: /swagger-ui.html
      info:
        title: "API de Produtos"
        version: "1.0.0"
        description: "Documentação da API de gerenciamento de produtos"
    
    ```
    

---

## 7. Melhores Práticas e Padrões de Uso

1. **Separe o DTO de Requisição do DTO de Resposta**
    - Use classes distintas (por exemplo, `ProdutoRequest` e `ProdutoResponse`) para evitar vazar campos confidenciais e manter clareza na documentação.
2. **Use Anotações JSR-303 para Validação e Confiança na Documentação**
    - Ao anotar campos do DTO com `@NotNull`, `@Size`, `@Min`, `@Max`, o SpringDoc automaticamente registra esses detalhes no esquema (`required`, `minLength`, `maxLength`, etc.).
3. **Forneça Exemplos Representativos**
    - Exemplos ajudam muito consumidores novos a entender o formato exato de envio. Sempre inclua ao menos um `@ExampleObject`.
4. **Documente Claramente Campos Opcionais x Obrigatórios**
    - No DTO, marque explicitamente (`@NotBlank`, `@NotNull`, etc.), e use `required = true` em `@Schema` para reforçar a indicação.
5. **Agrupe Endpoints por Tags Lógicas**
    - Use `@Tag(name = "...", description = "...")` nos controllers ou em `@Operation` para facilitar a navegação na UI (por exemplo, “Usuários”, “Produtos”, “Pedidos”).
6. **Evite DTOs Excessivamente Grandes**
    - Se um DTO ficar com dezenas de campos, considere dividi-lo em sub-objetos ou usar `allOf` para compor esquemas menores.
7. **Mantenha os Schemas Atualizados com o Código**
    - Ao alterar um campo (ex: renomear, mudar tipo), atualize as anotações para evitar inconsistências. Use testes automatizados para validar geração de OpenAPI.
8. **Versionamento da API**
    - Se planeja manter múltiplas versões (v1, v2), crie pacotes ou controllers separados e utilize `@OpenAPIDefinition(servers = {@Server(url="/v1")})` para cada versão.

---

## 8. Exemplo Prático Completo

A seguir, um mini-projeto Spring Boot que demonstra passo a passo como documentar o **Request Body** usando SpringDoc.

### 8.1 Dependências (pom.xml)

```xml
<dependencies>
    <!-- Spring Boot Starter Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- Bean Validation (JSR-303) -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>

    <!-- SpringDoc OpenAPI -->
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>2.2.0</version>
    </dependency>
</dependencies>

```

> Comentário:
> 
> - A versão `2.2.0` do `springdoc-openapi-starter-webmvc-ui` já inclui todas as anotações necessárias e configura o Swagger UI em `/swagger-ui.html`.

---

### 8.2 Classe Principal da Aplicação

```java
package com.exemplo.api;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@OpenAPIDefinition(
    info = @Info(
        title = "API de Produtos",
        version = "1.0.0",
        description = "API para gerenciar produtos (criação, atualização, listagem, remoção)"
    )
)
@SpringBootApplication
public class ApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApiApplication.class, args);
    }
}

```

---

### 8.3 DTO de Requisição (ProdutoRequest.java)

```java
package com.exemplo.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Schema(name = "ProdutoRequest", description = "Dados necessários para criar ou atualizar um produto")
public class ProdutoRequest {

    @Schema(description = "Nome do produto",
            example = "Teclado Mecânico",
            required = true)
    @NotBlank(message = "O nome é obrigatório")
    private String nome;

    @Schema(description = "Descrição detalhada do produto",
            example = "Teclado mecânico RGB com switches Brown")
    private String descricao;

    @Schema(description = "Preço unitário do produto em reais",
            example = "249.90",
            format = "double",
            required = true)
    @NotNull(message = "O preço é obrigatório")
    private Double preco;

    // Construtores, getters e setters omitidos para brevidade
}

```

---

### 8.4 DTO de Resposta (ProdutoResponse.java)

```java
package com.exemplo.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "ProdutoResponse", description = "Dados retornados após a criação ou busca de um produto")
public class ProdutoResponse {

    @Schema(description = "Identificador único do produto", example = "102")
    private Long id;

    @Schema(description = "Nome do produto", example = "Teclado Mecânico")
    private String nome;

    @Schema(description = "Descrição detalhada do produto", example = "Teclado mecânico RGB com switches Brown")
    private String descricao;

    @Schema(description = "Preço unitário do produto em reais", example = "249.90", format = "double")
    private Double preco;

    // Construtores, getters e setters omitidos para brevidade

    public ProdutoResponse(Long id, String nome, String descricao, Double preco) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;
    }
}

```

---

### 8.5 Controller (ProdutoController.java)

```java
package com.exemplo.api.controller;

import com.exemplo.api.dto.ProdutoRequest;
import com.exemplo.api.dto.ProdutoResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/produtos")
@Tag(name = "Produtos", description = "Operações relacionadas a produtos")
public class ProdutoController {

    @Operation(
        summary = "Cria um novo produto",
        description = "Endpoint para criar um novo produto e retornar seus dados com ID gerado",
        requestBody = @RequestBody(
            description = "Payload contendo nome, descrição (opcional) e preço do produto",
            required = true,
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ProdutoRequest.class),
                examples = @ExampleObject(
                    name = "ExemploCriacao",
                    value = "{\n" +
                            "  \"nome\": \"Mouse Gamer\",\n" +
                            "  \"descricao\": \"Mouse Gamer RGB com 6 botões\",\n" +
                            "  \"preco\": 129.90\n" +
                            "}"
                )
            )
        ),
        responses = {
            @ApiResponse(responseCode = "201", description = "Produto criado com sucesso",
                content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = ProdutoResponse.class)
                )
            ),
            @ApiResponse(responseCode = "400", description = "Dados de requisição inválidos")
        }
    )
    @PostMapping
    public ResponseEntity<ProdutoResponse> criarProduto(
            @Validated @org.springframework.web.bind.annotation.RequestBody ProdutoRequest dto) {
        // Simulação de lógica de persistência:
        Long idGerado = 100L; // Exemplo fixo; normalmente viria do banco
        ProdutoResponse response = new ProdutoResponse(
            idGerado,
            dto.getNome(),
            dto.getDescricao(),
            dto.getPreco()
        );
        // Retornamos URI Location e o objeto criado
        URI location = URI.create(String.format("/api/produtos/%d", idGerado));
        return ResponseEntity.created(location).body(response);
    }

    @Operation(
        summary = "Atualiza um produto existente",
        description = "Atualiza os dados de um produto pelo seu ID",
        requestBody = @RequestBody(
            description = "Payload com novos dados do produto",
            required = true,
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ProdutoRequest.class),
                examples = @ExampleObject(
                    name = "ExemploAtualizacao",
                    value = "{\n" +
                            "  \"nome\": \"Teclado Gamer Top\",\n" +
                            "  \"descricao\": \"Switches Red e iluminação RGB\",\n" +
                            "  \"preco\": 349.90\n" +
                            "}"
                )
            )
        ),
        responses = {
            @ApiResponse(responseCode = "200", description = "Produto atualizado com sucesso",
                content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = ProdutoResponse.class)
                )
            ),
            @ApiResponse(responseCode = "404", description = "Produto não encontrado"),
            @ApiResponse(responseCode = "400", description = "Dados de requisição inválidos")
        }
    )
    @PutMapping("/{id}")
    public ResponseEntity<ProdutoResponse> atualizarProduto(
            @PathVariable("id") Long id,
            @Validated @org.springframework.web.bind.annotation.RequestBody ProdutoRequest dto) {
        // Simulação de atualização:
        ProdutoResponse responseAtualizado = new ProdutoResponse(
            id,
            dto.getNome(),
            dto.getDescricao(),
            dto.getPreco()
        );
        return ResponseEntity.ok(responseAtualizado);
    }
}

```

> Comentários sobre este exemplo completo:
> 
> - **Rotas**: `/api/produtos` para criar (POST) e `/api/produtos/{id}` para atualizar (PUT).
> - **DTO de Requisição**: `ProdutoRequest` anotado com `@Schema` e JSR-303.
> - **RequestBody Documentado**: em cada método, usamos `@io.swagger.v3.oas.annotations.parameters.RequestBody` dentro de `@Operation`.
> - **Exemplos de JSON**: via `@ExampleObject` exibem um payload de criação e um de atualização.
> - **Respostas**: `@ApiResponse` com códigos 201, 200, 400 e 404, mostrando tanto sucesso quanto erros.
> - **Validação**: `@Validated` + anotações JSR-303 fazem com que, se enviar campo faltando ou inválido, o Spring retorne HTTP 400 automaticamente.
> - Ao executar a aplicação e navegar em `http://localhost:8080/swagger-ui.html`, você verá:
>     - Uma seção “Schemas” contendo `ProdutoRequest` e `ProdutoResponse`.
>     - Em “POST /api/produtos”, um exemplo de Request Body, com descrição e campos destacados como obrigatórios.

---

## 9. Sugestões para Aprofundamento

1. **Documentação Oficial do SpringDoc**
    - [SpringDoc OpenAPI Reference](https://springdoc.org/) – guia completo de anotações e configurações.
2. **Especificação OpenAPI 3.0**
    - [OpenAPI Specification](https://spec.openapis.org/oas/v3.0.3) – entenda o padrão de metadados que o SpringDoc expõe.
3. **Validação Avançada de Schemas**
    - Explore anotações como `@Pattern`, `@Min`, `@Max` em DTOs e veja como o SpringDoc reflete essas restrições no JSON Schema gerado.
4. **Customização do Swagger UI**
    - Ajuste títulos, logos, autorizações com `springdoc.swagger-ui.*` no `application.properties`.
5. **Combinação de Componentes (allOf/oneOf/anyOf)**
    - Cenários onde um endpoint aceita distintos tipos de payloads (pois herda propriedades de um modelo base).
6. **Testes Automatizados da Documentação**
    - Utilize bibliotecas como `springdoc-openapi-testing` para validar, em testes, se seu OpenAPI JSON atende critérios específicos.

---

> Conclusão
> 
> 
> A documentação do **Request Body** via SpringDoc (OpenAPI) é feita sobretudo anotando corretamente:
> 
> 1. **DTOs** com `@Schema` e validações JSR-303.
> 2. **Controllers** com `@Operation(requestBody = @RequestBody(...))`.
> 3. **Exemplos e descrições ricas** para orientar consumidores.
>     
>     Assim, o Swagger UI exibirá de forma clara todos os campos necessários, exemplos de payload e mensagens de erro/padrões de validação. Seguindo as melhores práticas apresentadas, sua API ganhará maior clareza, confiabilidade e facilidade de uso para quem consumi-la.
>