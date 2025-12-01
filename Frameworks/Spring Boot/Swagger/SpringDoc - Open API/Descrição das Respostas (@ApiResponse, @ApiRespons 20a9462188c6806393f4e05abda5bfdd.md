# Descrição das Respostas (@ApiResponse, @ApiResponses)

---

## 1. Introdução

SpringDoc (OpenAPI) é uma biblioteca que permite gerar automaticamente documentação no padrão OpenAPI (Swagger) para aplicações Spring Boot. Uma das funcionalidades cruciais é a capacidade de descrever **respostas de API** de forma detalhada, informando códigos HTTP, descrições e esquemas de dados associados. As anotações `@ApiResponse` e `@ApiResponses`, fornecidas pelo pacote `io.swagger.v3.oas.annotations.responses`, permitem personalizar esse aspecto da documentação, garantindo clareza para consumidores da API.

---

## 2. Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conceitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    1. Annotation `@ApiResponse`
    2. Annotation `@ApiResponses`
    3. Relacionamento com `@Operation` (OpenAPI 3)
    4. Exemplos de Código Comentados
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
    1. `@Operation`
    2. `@ApiResponse`, `@ApiResponses`
    3. `@Content` e `@Schema`
    4. Classes de Exceção Genéricas
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## 3. Conceitos Fundamentais

**OpenAPI (Swagger)**

- É uma especificação para descrever APIs RESTful de forma padronizada, tornando possível expô-las em uma interface interativa (Swagger UI) e gerar clientes automaticamente.

**SpringDoc (OpenAPI)**

- Projeto que integra o Spring Boot ao ecossistema OpenAPI 3, escaneando controladores, endpoints e anotações para gerar o arquivo `openapi.json` (ou `yaml`) automaticamente.
- Permite personalizar detalhes da documentação por meio de anotações como `@Operation`, `@Parameter`, `@ApiResponse` etc.

**Documentação de Respostas (Responses)**

- Cada endpoint HTTP pode retornar múltiplos códigos de status (por exemplo, 200 OK, 404 Not Found, 500 Internal Server Error).
- Fornecer descrições claras para cada possível resposta ajuda consumidores de API a entenderem exatamente o que esperar e como tratar cada caso.
- Anotações `@ApiResponse` e `@ApiResponses` são usadas para detalhar esses cenários de retorno:
    - Código HTTP (`responseCode`)
    - Descrição (`description`)
    - Tipo de conteúdo (`content`), incluindo esquema de dados (`@Schema`)

---

## 4. Sintaxe Detalhada e Uso Prático

### 4.1. Annotation `@ApiResponse`

- Utilizada para definir **uma única** resposta de API.
- Atributos principais:
    - `responseCode` (string): Código HTTP, ex: `"200"` ou `"404"`.
    - `description` (string): Breve descrição da resposta.
    - `content` (array de `@Content`): Define o tipo de mídia e o esquema de dados retornado.

```java
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Exemplo de uso isolado de @ApiResponse em um método de controle:
 */
@ApiResponse(
    responseCode = "200",
    description = "Requisição bem-sucedida. Retorna lista de usuários.",
    content = @Content(
        mediaType = "application/json",
        schema = @Schema(implementation = UserDto.class)
    )
)
/*
  Neste caso, estamos documentando apenas a resposta 200.
  Se houver outras respostas (404, 500), será necessário usar @ApiResponses.
*/
@GetMapping("/users")
public ResponseEntity<List<UserDto>> getAllUsers() {
    // lógica de busca de usuários...
}

```

- **Explicação dos elementos**:
    1. `responseCode = "200"` → Especifica o código HTTP retornado.
    2. `description = "Requisição bem-sucedida...."` → Mensagem descritiva no Swagger UI.
    3. `content = @Content(...)` → Descreve o tipo de mídia e o esquema associado.
        - `mediaType = "application/json"` → Define que a resposta é JSON.
        - `schema = @Schema(implementation = UserDto.class)` → Indica a classe Java que representa o payload no corpo da resposta.

---

### 4.2. Annotation `@ApiResponses`

- Agrupa múltiplos `@ApiResponse` em uma única anotação.
- Útil para descrever todos os possíveis cenários de resposta de um mesmo endpoint.

```java
import io.swagger.v3.oas.annotations.responses.ApiResponses;

/**
 * Exemplo de @ApiResponses documentando vários status:
 */
@ApiResponses(value = {
    @ApiResponse(
        responseCode = "200",
        description = "Usuário encontrado com sucesso",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = UserDto.class)
        )
    ),
    @ApiResponse(
        responseCode = "404",
        description = "Usuário não encontrado",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = ErrorResponse.class)
        )
    ),
    @ApiResponse(
        responseCode = "500",
        description = "Erro interno no servidor",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = ErrorResponse.class)
        )
    )
})
@GetMapping("/users/{id}")
public ResponseEntity<UserDto> getUserById(
        @PathVariable("id") Long userId) {
    // lógica para buscar usuário por ID...
}

```

- **Detalhes comentados**:
    1. `value = { ... }` → Array de várias definições `@ApiResponse`.
    2. Cada `@ApiResponse` segue a mesma estrutura do exemplo anterior.
    3. Para cada status (200, 404, 500), especifica-se também o `@Content` com o `@Schema` correspondente:
        - `UserDto` para resposta bem-sucedida.
        - `ErrorResponse` para erros (poderia ser um DTO específico que carrega mensagem, código, timestamp, etc.).

---

### 4.3. Relacionamento com `@Operation` (OpenAPI 3)

- A anotação `@Operation` (pacote `io.swagger.v3.oas.annotations`) pode englobar parâmetros, descrição, tags e respostas.
- Dentro de `@Operation`, é comum incluir `responses = {@ApiResponse(...)}`, mas é opcional — as anotações podem ficar diretamente no método também.

```java
import io.swagger.v3.oas.annotations.Operation;

@Operation(
    summary = "Busca usuário por ID",
    description = "Retorna detalhes de um usuário específico dado o identificador.",
    responses = {
        @ApiResponse(
            responseCode = "200",
            description = "Usuário encontrado",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = UserDto.class)
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Usuário não encontrado",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ErrorResponse.class)
            )
        )
    }
)
@GetMapping("/users/{id}")
public ResponseEntity<UserDto> getUserById(
        @PathVariable("id") Long userId) {
    // implementação...
}

```

- **Vantagens de usar `@Operation`**:
    - Consolidar metadados (resumo, descrição, tags) e respostas em uma mesma anotação.
    - Facilita a leitura e manutenção de documentação no código.

---

### 4.4. Exemplos de Código Comentados

### 4.4.1. Controlador Simples para Cadastro de Produtos

```java
package com.example.api.controller;

import com.example.api.dto.ProductDto;
import com.example.api.dto.ErrorResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller para gerenciar produtos.
 * Demonstração de uso de @ApiResponse e @ApiResponses para documentar respostas.
 */
@RestController
@RequestMapping("/products")
public class ProductController {

    /**
     * Retorna lista de todos os produtos.
     */
    @Operation(summary = "Listar produtos", description = "Retorna todos os produtos cadastrados no sistema.")
    @ApiResponse(
        responseCode = "200",
        description = "Lista de produtos retornada com sucesso",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = ProductDto.class) // Quando o retorno for lista, SpringDoc considera List<ProductDto>
        )
    )
    @GetMapping
    public ResponseEntity<List<ProductDto>> getAllProducts() {
        // Lógica para obter produtos...
        return ResponseEntity.ok(List.of(
            new ProductDto(1L, "Notebook", 3500.0),
            new ProductDto(2L, "Smartphone", 2200.0)
        ));
    }

    /**
     * Busca produto por ID. Demonstração de múltiplos cenários de resposta.
     */
    @Operation(summary = "Buscar produto por ID", description = "Retorna um produto específico pelo seu identificador.")
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Produto encontrado",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ProductDto.class)
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Produto não encontrado",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ErrorResponse.class)
            )
        )
    })
    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable("id") Long id) {
        // Exemplo de busca. Em um cenário real, faria consulta no BD.
        if (id.equals(1L)) {
            return ResponseEntity.ok(new ProductDto(1L, "Notebook", 3500.0));
        } else {
            return ResponseEntity.status(404).body(null); // Exemplo rápido. Poderia retornar um ErrorResponse.
        }
    }

    /**
     * Cria um novo produto. Exemplo de documentação para 201 e 400.
     */
    @Operation(summary = "Criar produto", description = "Insere um novo produto no sistema.")
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "Produto criado com sucesso",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ProductDto.class)
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Requisição inválida (dados ausentes ou inválidos)",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ErrorResponse.class)
            )
        )
    })
    @PostMapping
    public ResponseEntity<ProductDto> createProduct(@RequestBody ProductDto product) {
        // Aqui, em um cenário real, salvaríamos o produto no BD e retornaríamos o recurso criado.
        product.setId(3L);
        return ResponseEntity.status(201).body(product);
    }
}

```

- **Comentários principais**:
    1. Endpoint `GET /products` utiliza apenas um `@ApiResponse` para documentar o status 200.
    2. Endpoint `GET /products/{id}` agrupa dois `@ApiResponse` (200 e 404) dentro de `@ApiResponses`.
    3. Endpoint `POST /products` exemplifica códigos 201 (Created) e 400 (Bad Request).

### 4.4.2. DTOs de Exemplo

```java
package com.example.api.dto;

/**
 * DTO representando um produto.
 */
public class ProductDto {
    private Long id;
    private String name;
    private Double price;

    // Construtores, getters e setters juntos (omitidos para brevidade)
    public ProductDto() {}
    public ProductDto(Long id, String name, Double price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
    // Getters e setters...
}

```

```java
package com.example.api.dto;

/**
 * DTO genérico para retorno de erros.
 */
public class ErrorResponse {
    private String timestamp;
    private Integer status;
    private String error;
    private String message;
    private String path;

    // Construtores, getters e setters (omitidos para brevidade)
    public ErrorResponse() {}
    public ErrorResponse(String timestamp, Integer status, String error, String message, String path) {
        this.timestamp = timestamp;
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
    }
    // Getters e setters...
}

```

- Nesse exemplo, o `@Schema(implementation = ErrorResponse.class)` indica que, sempre que o endpoint retornar um código de erro, o corpo poderá seguir a estrutura de `ErrorResponse` (com campos como `timestamp`, `status`, `error`, etc.).

---

## 5. Cenários de Restrição ou Não Aplicação

1. **Endpoints Simples com Retorno Único e Predeterminado**
    - Se todos os endpoints sempre retornam apenas 200 OK, com um único tipo de payload, pode não ser necessário usar múltiplas anotações de resposta.
    - Neste caso, documentar globalmente (via properties ou configurações do SpringDoc) pode bastar.
2. **Ambientes que Não Necessitam de Documentação Extensa**
    - Em APIs internas ou protótipos rápidos onde a equipe já conhece o comportamento, registrar cada código de erro pode gerar sobrecarga.
    - Nesses cenários, documentar apenas o “happy path” (caminho principal) é aceitável, embora não seja recomendável para produção.
3. **Endpoints com Múltiplos Códigos que Dependeriam de Lógica Complexa**
    - Quando a lógica de negócio gera inúmeros códigos de erro (por exemplo, um endpoint que valida 15 condições diferentes), listar todas as respostas manualmente pode se tornar difícil de manter.
    - Alternativa: usar um único `@ApiResponse` genérico (ex: “400 – Requisição inválida com detalhes no corpo”) e capturar exceções específicas em um `@ControllerAdvice` que padroniza `ErrorResponse`.
4. **APIs Não RESTful ou WebSockets**
    - As anotações `@ApiResponse`/`@ApiResponses` são específicas para documentação REST (HTTP). Em WebSockets ou gRPC, não se aplicam diretamente.

---

## 6. Componentes Chave Associados

### 6.1. `@Operation`

- Pacote: `io.swagger.v3.oas.annotations`
- Função: define metadados de um endpoint, como título (`summary`), descrição detalhada (`description`), tags, parâmetros, respostas (`responses`) e segurança.
- Exemplo:
    
    ```java
    @Operation(
        summary = "Obter lista de usuários",
        description = "Retorna todos os usuários cadastrados no sistema.",
        tags = {"Usuários"},
        responses = { /* array de @ApiResponse */ }
    )
    
    ```
    

### 6.2. `@ApiResponse` e `@ApiResponses`

- Pacote: `io.swagger.v3.oas.annotations.responses`
- `@ApiResponse`: Documenta uma resposta única.
    - `responseCode`: expressão string do código HTTP.
    - `description`: texto descritivo.
    - `content`: array de `@Content`, define mídia e esquema.
- `@ApiResponses`: Contém múltiplos `@ApiResponse`.
    - Uso:
        
        ```java
        @ApiResponses({
            @ApiResponse(responseCode="200", description="OK", content=...),
            @ApiResponse(responseCode="404", description="Not Found", content=...)
        })
        
        ```
        

### 6.3. `@Content` e `@Schema`

- `@Content`
    - Pacote: `io.swagger.v3.oas.annotations.media`
    - Especifica o tipo de mídia (`mediaType`) e o `schema` associado para aquela resposta.
    - Exemplo:
        
        ```java
        @Content(
          mediaType = "application/json",
          schema = @Schema(implementation = UserDto.class)
        )
        
        ```
        
- `@Schema`
    - Pacote: `io.swagger.v3.oas.annotations.media`
    - Descreve o formato do objeto retornado:
        - `implementation`: classe Java que modela o JSON.
        - `description`, `example`, `required`, `defaultValue` etc.

### 6.4. Classes de Exceção e Mapeamento Global

- **`@ControllerAdvice` + `@ExceptionHandler`**
    - Permite centralizar o tratamento de exceções e retornar sempre um `ErrorResponse` padronizado.
    - Exemplo:
        
        ```java
        @ControllerAdvice
        public class GlobalExceptionHandler {
        
            @ExceptionHandler(ResourceNotFoundException.class)
            public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex, HttpServletRequest request) {
                ErrorResponse error = new ErrorResponse(
                    LocalDateTime.now().toString(),
                    HttpStatus.NOT_FOUND.value(),
                    "Recurso não encontrado",
                    ex.getMessage(),
                    request.getRequestURI()
                );
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
        
            @ExceptionHandler(Exception.class)
            public ResponseEntity<ErrorResponse> handleGeneralError(Exception ex, HttpServletRequest request) {
                ErrorResponse error = new ErrorResponse(
                    LocalDateTime.now().toString(),
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Erro interno",
                    ex.getMessage(),
                    request.getRequestURI()
                );
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
            }
        }
        
        ```
        
    - Dessa forma, no Swagger, sempre que ocorrer uma exceção, o corpo segue a estrutura `ErrorResponse`, que deve ser referenciada nas anotações `@ApiResponse`.

---

## 7. Melhores Práticas e Padrões de Uso

1. **Documentar Sempre o “Caminho Feliz” e os Principais Erros**
    - Inclua, no mínimo, respostas para os códigos:
        - **200/201** – Sucesso (retorno esperado).
        - **400** – Requisição Inválida (payload ou parâmetros incorretos).
        - **401/403** – Autenticação/Autorização (se aplicável).
        - **404** – Recurso Não Encontrado.
        - **500** – Erro Interno.
2. **Utilizar DTOs Específicos para Respostas de Erro**
    - Crie um model (`ErrorResponse`, `ValidationErrorResponse`) para padronizar o JSON.
    - Nas anotações `@ApiResponse`, referencie esse DTO sempre que for retorno de erro.
3. **Evitar Duplicação de Anotações**
    - Caso vários endpoints retornem os mesmos cenários de erro (por exemplo, 400 e 500 identicamente), avalie criar um “componente global” no `@OpenAPIDefinition` ou aplicar anotações em classes-base ou interfaces comuns, reduzindo repetição.
4. **Manter Descrições Objetivas e Úteis**
    - A descrição (`description`) deve ser breve, mas informativa, deixando claro o que cada código HTTP significa.
    - Exemplo:
        - **200**: “Requisição válida. Retorna recurso solicitado.”
        - **404**: “Recurso não encontrado para o ID informado.”
5. **Usar Exemplos (`@ExampleObject`) Quando Possível**
    - Anotações adicionais permitem exemplificar o corpo de resposta, facilitando entendimento de quem consome a API.
    - Exemplo:
        
        ```java
        @ApiResponse(
            responseCode = "200",
            description = "Usuário encontrado",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = UserDto.class),
                examples = @ExampleObject(value = "{\"id\":1,\"name\":\"João\",\"email\":\"joao@email.com\"}")
            )
        )
        
        ```
        
6. **Agrupar Anotações Via Interfaces ou Classes Abstratas (Se Repetitivo)**
    - Se múltiplos controladores compartilham os mesmos códigos de resposta, crie uma interface com métodos anotados e faça os controladores estenderem essa interface, herdar as anotações e sobrescrever somente quando necessário.

---

## 8. Exemplo Prático Completo

A seguir, um projeto simplificado que demonstra todas as etapas, desde a configuração de dependências até a exposição no Swagger UI de respostas documentadas.

### 8.1. Dependências no `pom.xml`

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" ...>
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.example</groupId>
    <artifactId>springdoc-example</artifactId>
    <version>1.0.0</version>
    <properties>
        <java.version>17</java.version>
        <spring.boot.version>3.1.0</spring.boot.version>
    </properties>
    <dependencies>
        <!-- Spring Boot Starter Web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
            <version>${spring.boot.version}</version>
        </dependency>

        <!-- SpringDoc OpenAPI 3 -->
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>2.1.0</version>
        </dependency>

        <!-- (Opcional) Validação de Beans para exemplos de 400 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
            <version>${spring.boot.version}</version>
        </dependency>
    </dependencies>
    <build>
        <plugins>
            <!-- Plugin Spring Boot -->
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <version>${spring.boot.version}</version>
            </plugin>
        </plugins>
    </build>
</project>

```

- **Explicação**:
    1. `springdoc-openapi-starter-webmvc-ui` inclui tudo que precisa para gerar `openapi.json` e expor o Swagger UI em `/swagger-ui.html`.
    2. A versão usada (2.1.0) é compatível com Spring Boot 3.

### 8.2. Estrutura de Pacotes

```
src/main/java
└── com
    └── example
        ├── SpringdocExampleApplication.java
        ├── controller
        │   └── ProductController.java
        ├── dto
        │   ├── ProductDto.java
        │   └── ErrorResponse.java
        └── exception
            └── GlobalExceptionHandler.java

```

### 8.3. Classe Principal (`SpringdocExampleApplication.java`)

```java
package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SpringdocExampleApplication {
    public static void main(String[] args) {
        SpringApplication.run(SpringdocExampleApplication.class, args);
    }
}

```

### 8.4. DTOs

> ProductDto.java
> 
> 
> ```java
> package com.example.dto;
> 
> import io.swagger.v3.oas.annotations.media.Schema;
> 
> @Schema(description = "Representa um produto no sistema")
> public class ProductDto {
>     @Schema(description = "Identificador único do produto", example = "1")
>     private Long id;
> 
>     @Schema(description = "Nome do produto", example = "Notebook Dell")
>     private String name;
> 
>     @Schema(description = "Preço do produto em reais", example = "3500.0")
>     private Double price;
> 
>     // Construtores, getters e setters...
>     public ProductDto() {}
>     public ProductDto(Long id, String name, Double price) {
>         this.id = id;
>         this.name = name;
>         this.price = price;
>     }
>     // Getters e setters...
> }
> 
> ```
> 

> ErrorResponse.java
> 
> 
> ```java
> package com.example.dto;
> 
> import io.swagger.v3.oas.annotations.media.Schema;
> 
> @Schema(description = "Modelo de resposta para erros padronizados")
> public class ErrorResponse {
>     @Schema(description = "Timestamp do erro", example = "2025-06-06T14:00:00")
>     private String timestamp;
> 
>     @Schema(description = "Código HTTP do erro", example = "404")
>     private Integer status;
> 
>     @Schema(description = "Título breve do erro", example = "Recurso não encontrado")
>     private String error;
> 
>     @Schema(description = "Mensagem detalhada do erro", example = "Produto com ID 5 não existe")
>     private String message;
> 
>     @Schema(description = "URI requisitada", example = "/products/5")
>     private String path;
> 
>     // Construtores, getters e setters...
>     public ErrorResponse() {}
>     public ErrorResponse(String timestamp, Integer status, String error, String message, String path) {
>         this.timestamp = timestamp;
>         this.status = status;
>         this.error = error;
>         this.message = message;
>         this.path = path;
>     }
>     // Getters e setters...
> }
> 
> ```
> 

### 8.5. Tratamento Global de Exceções

> GlobalExceptionHandler.java
> 
> 
> ```java
> package com.example.exception;
> 
> import com.example.dto.ErrorResponse;
> import org.springframework.http.HttpStatus;
> import org.springframework.http.ResponseEntity;
> import org.springframework.web.bind.MethodArgumentNotValidException;
> import org.springframework.web.bind.annotation.ControllerAdvice;
> import org.springframework.web.bind.annotation.ExceptionHandler;
> 
> import jakarta.servlet.http.HttpServletRequest;
> import java.time.LocalDateTime;
> 
> @ControllerAdvice
> public class GlobalExceptionHandler {
> 
>     @ExceptionHandler(ResourceNotFoundException.class)
>     public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex, HttpServletRequest request) {
>         ErrorResponse error = new ErrorResponse(
>             LocalDateTime.now().toString(),
>             HttpStatus.NOT_FOUND.value(),
>             "Recurso não encontrado",
>             ex.getMessage(),
>             request.getRequestURI()
>         );
>         return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
>     }
> 
>     @ExceptionHandler(MethodArgumentNotValidException.class)
>     public ResponseEntity<ErrorResponse> handleValidationError(MethodArgumentNotValidException ex, HttpServletRequest request) {
>         // Para simplificar, recuperamos a primeira mensagem de erro de validação
>         String validationMessage = ex.getBindingResult().getAllErrors().get(0).getDefaultMessage();
>         ErrorResponse error = new ErrorResponse(
>             LocalDateTime.now().toString(),
>             HttpStatus.BAD_REQUEST.value(),
>             "Falha na validação de entrada",
>             validationMessage,
>             request.getRequestURI()
>         );
>         return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
>     }
> 
>     @ExceptionHandler(Exception.class)
>     public ResponseEntity<ErrorResponse> handleGeneralError(Exception ex, HttpServletRequest request) {
>         ErrorResponse error = new ErrorResponse(
>             LocalDateTime.now().toString(),
>             HttpStatus.INTERNAL_SERVER_ERROR.value(),
>             "Erro interno",
>             ex.getMessage(),
>             request.getRequestURI()
>         );
>         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
>     }
> }
> 
> ```
> 
- **Observações**:
    1. `ResourceNotFoundException` seria uma exceção customizada lançada quando um recurso não existe.
    2. `MethodArgumentNotValidException` é disparada quando há falha na validação de `@Valid` em parâmetros de método.
    3. O handler genérico para `Exception` captura todos os demais erros, retornando 500.

### 8.6. Controlador com Documentação Detalhada

> ProductController.java
> 
> 
> ```java
> package com.example.controller;
> 
> import com.example.dto.ProductDto;
> import com.example.dto.ErrorResponse;
> import com.example.exception.ResourceNotFoundException;
> 
> import io.swagger.v3.oas.annotations.Operation;
> import io.swagger.v3.oas.annotations.responses.ApiResponse;
> import io.swagger.v3.oas.annotations.responses.ApiResponses;
> import io.swagger.v3.oas.annotations.media.Content;
> import io.swagger.v3.oas.annotations.media.Schema;
> import io.swagger.v3.oas.annotations.media.ExampleObject;
> 
> import org.springframework.http.ResponseEntity;
> import org.springframework.validation.annotation.Validated;
> import org.springframework.web.bind.annotation.*;
> 
> import jakarta.validation.Valid;
> import jakarta.validation.constraints.NotBlank;
> import jakarta.validation.constraints.NotNull;
> import jakarta.validation.constraints.Positive;
> 
> import java.util.ArrayList;
> import java.util.List;
> import java.util.concurrent.ConcurrentHashMap;
> import java.util.concurrent.ConcurrentMap;
> 
> /**
>  * Controller para gerenciar produtos.
>  */
> @RestController
> @RequestMapping("/products")
> @Validated
> public class ProductController {
> 
>     // Simulação de repositório em memória
>     private final ConcurrentMap<Long, ProductDto> productRepo = new ConcurrentHashMap<>();
> 
>     public ProductController() {
>         // Populando repositório inicial
>         productRepo.put(1L, new ProductDto(1L, "Notebook Dell", 3500.0));
>         productRepo.put(2L, new ProductDto(2L, "Smartphone Samsung", 2200.0));
>     }
> 
>     /**
>      * Lista todos os produtos.
>      */
>     @Operation(summary = "Listar todos os produtos", description = "Retorna uma lista com todos os produtos disponíveis.")
>     @ApiResponse(
>         responseCode = "200",
>         description = "Lista de produtos retornada com sucesso",
>         content = @Content(
>             mediaType = "application/json",
>             schema = @Schema(implementation = ProductDto.class),
>             examples = @ExampleObject(value = "[{\"id\":1,\"name\":\"Notebook Dell\",\"price\":3500.0}, {\"id\":2,\"name\":\"Smartphone Samsung\",\"price\":2200.0}]")
>         )
>     )
>     @GetMapping
>     public ResponseEntity<List<ProductDto>> getAllProducts() {
>         return ResponseEntity.ok(new ArrayList<>(productRepo.values()));
>     }
> 
>     /**
>      * Busca produto por ID.
>      */
>     @Operation(summary = "Buscar produto por ID", description = "Busca detalhes de um produto pelo seu identificador.")
>     @ApiResponses(value = {
>         @ApiResponse(
>             responseCode = "200",
>             description = "Produto encontrado com sucesso",
>             content = @Content(
>                 mediaType = "application/json",
>                 schema = @Schema(implementation = ProductDto.class),
>                 examples = @ExampleObject(value = "{\"id\":1,\"name\":\"Notebook Dell\",\"price\":3500.0}")
>             )
>         ),
>         @ApiResponse(
>             responseCode = "404",
>             description = "Produto não encontrado",
>             content = @Content(
>                 mediaType = "application/json",
>                 schema = @Schema(implementation = ErrorResponse.class),
>                 examples = @ExampleObject(value = "{\"timestamp\":\"2025-06-06T14:10:00\",\"status\":404,\"error\":\"Recurso não encontrado\",\"message\":\"Produto com ID 5 não existe\",\"path\":\"/products/5\"}")
>             )
>         )
>     })
>     @GetMapping("/{id}")
>     public ResponseEntity<ProductDto> getProductById(
>             @PathVariable("id") @NotNull @Positive(message = "ID deve ser positivo") Long id) {
>         ProductDto product = productRepo.get(id);
>         if (product == null) {
>             throw new ResourceNotFoundException("Produto com ID " + id + " não existe");
>         }
>         return ResponseEntity.ok(product);
>     }
> 
>     /**
>      * Cria um novo produto.
>      */
>     @Operation(summary = "Criar um produto", description = "Insere um novo produto no sistema.")
>     @ApiResponses(value = {
>         @ApiResponse(
>             responseCode = "201",
>             description = "Produto criado com sucesso",
>             content = @Content(
>                 mediaType = "application/json",
>                 schema = @Schema(implementation = ProductDto.class),
>                 examples = @ExampleObject(value = "{\"id\":3,\"name\":\"Teclado Mecânico\",\"price\":450.0}")
>             )
>         ),
>         @ApiResponse(
>             responseCode = "400",
>             description = "Requisição inválida – dados ausentes ou incorretos",
>             content = @Content(
>                 mediaType = "application/json",
>                 schema = @Schema(implementation = ErrorResponse.class),
>                 examples = @ExampleObject(value = "{\"timestamp\":\"2025-06-06T14:12:00\",\"status\":400,\"error\":\"Falha na validação de entrada\",\"message\":\"name: nome não pode ficar em branco\",\"path\":\"/products\"}")
>             )
>         )
>     })
>     @PostMapping
>     public ResponseEntity<ProductDto> createProduct(
>             @Valid @RequestBody ProductDto product) {
>         // Gerando um ID incremental (simples)
>         long nextId = productRepo.keySet().stream().mapToLong(Long::longValue).max().orElse(0L) + 1;
>         product.setId(nextId);
>         productRepo.put(nextId, product);
>         return ResponseEntity.status(201).body(product);
>     }
> }
> 
> ```
> 
- **Principais pontos do exemplo**:
    1. **Validadores**: o método `getProductById` valida se o `id` é positivo (`@Positive`). Em caso de falha, a exceção `MethodArgumentNotValidException` será capturada e documentada como 400.
    2. **Exemplos (`@ExampleObject`)**: mostram payloads de resposta reais, auxiliando quem consome a API a entender melhor o formato.
    3. **Tratamento de Exceções Personalizado**: `ResourceNotFoundException` resulta em 404, retornando `ErrorResponse` bem documentado.

---

### 8.7. Gerando e Acessando a Documentação Swagger UI

1. Execute a aplicação com `mvn spring-boot:run` (ou via IDE).
2. Acesse no navegador:
    
    ```
    http://localhost:8080/swagger-ui.html
    
    ```
    
3. Você verá a listagem de todas as rotas (`/products`, `/products/{id}`, `/products` POST) com descrições, parâmetros, exemplos de respostas e códigos HTTP documentados conforme as anotações acima.

---

## 9. Sugestões para Aprofundamento

- **Documentação Oficial SpringDoc**
    - [https://springdoc.org/](https://springdoc.org/)
- **Especificação OpenAPI 3**
    - [https://spec.openapis.org/oas/v3.1.0](https://spec.openapis.org/oas/v3.1.0)
- **Guia de Anotações do Swagger (io.swagger.v3.oas.annotations)**
    - [https://github.com/swagger-api/swagger-core/wiki/Annotations-1.5.X](https://github.com/swagger-api/swagger-core/wiki/Annotations-1.5.X)
- **Melhorias Avançadas**
    - Uso de `@Components` para definir esquemas reutilizáveis globalmente (`@Schema(name="...")`).
    - Configuração de segurança (Bearer JWT) nas rotas usando `@SecurityScheme` e `@SecurityRequirement`.
    - Customização do Swagger UI (tema, logotipo, propriedades de exibição).

---

### Observação Final

Documentar respostas de API com `@ApiResponse` e `@ApiResponses` garante **clareza**, **coerência** e **manutenibilidade** da documentação. Seguindo as práticas apresentadas, você consegue manter seu contrato de API sempre atualizado, proporcionando confiança e facilidade de uso aos consumidores dos seus serviços.

---

> Por onde começar?
> 
> 1. Adicione a dependência do SpringDoc no seu projeto.
> 2. Importe as anotações necessárias (`@Operation`, `@ApiResponse`, `@ApiResponses`, `@Content`, `@Schema`).
> 3. Documente cada endpoint, detalhando todos os cenários de retorno mais relevantes.
> 4. Teste o Swagger UI para verificar se todos os códigos, descrições e esquemas aparecem corretamente.

Bom trabalho na integração do SpringDoc e na documentação completa das respostas da sua API!