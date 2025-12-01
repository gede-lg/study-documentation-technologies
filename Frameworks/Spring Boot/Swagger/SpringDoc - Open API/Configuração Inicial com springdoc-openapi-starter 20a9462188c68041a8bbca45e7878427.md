# Configuração Inicial com springdoc-openapi-starter-webmvc-ui

---

## Título da Explicação

**Guia Completo: Configuração e Uso do Swagger (OpenAPI) via SpringDoc em Aplicações Spring Boot**

---

## 1. Introdução

O Swagger (agora padronizado como OpenAPI) tornou-se o principal recurso para documentar, testar e validar APIs RESTful. No ecossistema Spring Boot, o projeto **SpringDoc** oferece uma integração simples e leve, gerando automaticamente documentação JSON/YAML no padrão OpenAPI 3.0 e uma interface Swagger UI para exploração interativa dos endpoints. Neste guia, veremos desde a configuração inicial usando o *starter* `springdoc-openapi-starter-webmvc-ui` até um exemplo prático ponta a ponta.

---

## 2. Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conceitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    
    2.1. Dependências e Versões (pom.xml)
    
    2.2. Configuração Básica no application.properties/yml
    
    2.3. Anotações nos Controllers e Modelos
    
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
    
    4.1. `springdoc-openapi-starter-webmvc-ui`
    
    4.2. Anotações Principais (`@Operation`, `@Parameter`, `@Schema`, etc.)
    
    4.3. Classes de Configuração Complementares
    
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
    
    6.1. Estrutura do Projeto
    
    6.2. pom.xml com Dependências
    
    6.3. Configuração de Propriedades
    
    6.4. Implementação de um Controller Simples
    
    6.5. Provendo Metadados Adicionais (Info, Servers, Tags)
    
    6.6. Testando no Swagger UI
    
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## 3. Conceitos Fundamentais

Antes de partirmos para a configuração prática, é importante compreender:

- **OpenAPI vs. Swagger**:
    - *Swagger* refere-se originalmente ao conjunto de ferramentas criadas pela SmartBear (Swagger Editor, Swagger UI, Swagger Codegen).
    - A especificação evoluiu para o padrão **OpenAPI** (atualmente na versão 3.x), mantido pela The Linux Foundation.
    - Em essência, quando falamos “Swagger” neste contexto, estamos nos referindo ao uso de **Swagger UI** (a interface web) e **Swagger/OpenAPI JSON** (o contrato gerado).
- **Por que documentar sua API?**
    1. Facilita a comunicação entre desenvolvedores (backend/frontend).
    2. Permite testes interativos dos endpoints sem necessidade de clientes externos.
    3. Serve de base para geração de clientes (SDKs) automáticos.
    4. Garante consistência e clareza nos contratos RESTful.
- **SpringDoc (OpenAPI) x Springfox**:
    - *Springfox* era a biblioteca utilizada antigamente para integrar Swagger em projetos Spring.
    - Em 2025, **SpringDoc** já é o padrão mais maduro, pois suporta OpenAPI 3 nativamente, integra-se a versões recentes do Spring Boot e é mantido ativamente.

---

## 4. Sintaxe Detalhada e Uso Prático

### 4.1. Dependências e Versões (pom.xml)

Para iniciar a documentação automática, é preciso adicionar ao `pom.xml` (ou `build.gradle`) as dependências do SpringDoc. No Maven:

```xml
<!-- pom.xml -->
<dependencies>
    <!-- Dependência principal do SpringDoc para Web MVC com Swagger UI -->
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>2.1.0</version> <!-- Verificar a versão mais recente no repositório Maven Central -->
    </dependency>

    <!-- Dependência opcional: Anotações do Swagger (se quiser usar @Tag, @SecurityRequirement, etc.)-->
    <dependency>
        <groupId>io.swagger.core.v3</groupId>
        <artifactId>swagger-annotations</artifactId>
        <version>2.2.8</version>
    </dependency>

    <!-- Dependência do Spring Boot Starter Web (exemplo de projeto Web MVC) -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- Outras dependências (Spring Data, Lombok, etc.) -->
    <!-- ... -->
</dependencies>

```

> Observação:
> 
> - A versão `2.1.0` do `springdoc-openapi-starter-webmvc-ui` serve apenas de exemplo; sempre valide a última versão disponível em [Maven Central](https://search.maven.org/artifact/org.springdoc/springdoc-openapi-starter-webmvc-ui).
> - Não é necessário adicionar explicitamente `springdoc-openapi-webmvc-core` ou `springdoc-openapi-ui`: o *starter* já agrupa as bibliotecas necessárias para gerar e disponibilizar a UI.

---

### 4.2. Configuração Básica no application.properties/yml

Por padrão, o SpringDoc já expõe a especificação OpenAPI em `/v3/api-docs` e a interface Swagger UI em `/swagger-ui.html` (ou `/swagger-ui/index.html`). Caso seja necessário customizar, podemos incluir propriedades no `application.properties` (ou `application.yml`):

```
# application.properties

# Configurações do SpringDoc OpenAPI
springdoc.api-docs.path=/v3/api-docs         # Ponto de acesso para JSON da API
springdoc.swagger-ui.path=/swagger-ui.html   # URL para acessar a UI
springdoc.swagger-ui.operationsSorter=alpha  # Ordenação alfabética dos endpoints
springdoc.swagger-ui.tagsSorter=alpha        # Ordenação alfabética das tags
springdoc.swagger-ui.persistAuthorization=true   # Persiste token JWT no Swagger UI

```

Ou em YAML:

```yaml
# application.yml

springdoc:
  api-docs:
    path: /v3/api-docs
  swagger-ui:
    path: /swagger-ui.html
    operationsSorter: alpha
    tagsSorter: alpha
    persistAuthorization: true

```

> Dica: Se você já tiver endpoints mapeados em /v3/api-docs ou /swagger-ui.html, ajuste esses caminhos para não conflitar.
> 

---

### 4.3. Anotações nos Controllers e Modelos

Para enriquecer a documentação, usamos anotações do Swagger/OpenAPI diretamente nos controllers, parâmetros e modelos (DTOs). Abaixo alguns exemplos:

1. **@Operation**: descreve uma operação (endpoint) específica.
2. **@Parameter**: descreve parâmetros de método (query, path, header).
3. **@Schema**: adiciona metadados à classe ou atributo (descrição, formato, exemplo).
4. **@Tag**: agrupa endpoints em categorias lógicas.

### 4.3.1. Exemplos de uso

```java
package com.exemplo.api.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;

import javax.validation.constraints.NotBlank;

// Define um grupo (tag) genérico para endpoints de Autenticação
@Tag(name = "Autenticação", description = "Operações relacionadas ao processo de login e token")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Operation(
        summary = "Realiza autenticação de usuário",
        description = "Recebe credenciais (usuário e senha) e retorna um token JWT válido por X horas."
    )
    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(
        @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "Objeto contendo usuário e senha",
            required = true
        )
        @RequestBody LoginRequest request
    ) {
        // Lógica de autenticação (omitida)
        String jwt = "...";
        TokenResponse resp = new TokenResponse(jwt);
        return ResponseEntity.ok(resp);
    }
}

/**
 * Classe representando o payload de Login
 */
class LoginRequest {

    @Schema(description = "Nome de usuário ou email cadastrado", example = "usuario123", required = true)
    @NotBlank(message = "Campo 'username' não pode ser vazio")
    private String username;

    @Schema(description = "Senha do usuário (mínimo 8 caracteres)", example = "P4ssw0rd!", required = true, minLength = 8)
    @NotBlank(message = "Campo 'password' não pode ser vazio")
    private String password;

    // getters e setters (omitidos)
}

/**
 * Classe representando a resposta contendo o token JWT
 */
class TokenResponse {

    @Schema(description = "Token JWT de acesso", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String token;

    public TokenResponse(String token) {
        this.token = token;
    }

    // getter (omitido)
}

```

- **@Tag(name, description)**: agrupa endpoints; útil quando a API cresce.
- **@Operation(summary, description)**: define título e detalha cada rota.
- **@RequestBody (Swagger)**: descreve o objeto recebido no corpo da requisição.
- **@Schema(description, example, minLength, etc.)**: documenta atributos de classes (modelos).

> Observação:
> 
> 
> Se você usar anotações de validação (e.g., `@NotBlank`, `@Size`), o SpringDoc pode inferir automaticamente restrições (maxLength, formato, etc.) no JSON Schema gerado.
> 

---

## 5. Cenários de Restrição ou Não Aplicação

Embora o SpringDoc seja robusto, algumas situações podem não se adequar bem ao seu uso:

1. **APIs Internas ou Back-office Sem Documentação Externa**
    - Se a API não for exposta publicamente nem consumida fora do time, a sobrecarga de documentação interativa pode não ser necessária.
2. **Ambientes com Requisitos de Segurança Muito Restritos**
    - Em serviços que não permitem exposição de metadados em runtime (por política de segurança), talvez se opte pela geração de documentação offline (via arquivos OpenAPI versionados) em vez de permitir a UI ativa.
3. **APIs Não-RESTful ou Sem Controle pelo Spring MVC**
    - Caso você tenha endpoints puramente WebFlux (sem Web MVC) ou use outro framework (ex.: JAX-RS puro), a dependência `springdoc-openapi-starter-webmvc-ui` não é a escolha correta. Para WebFlux, existe o *starter* específico `springdoc-openapi-starter-webflux-ui`.
4. **APIs Legadas com Contratos JSON Complexos e Mapeamentos Dinâmicos**
    - Cenários onde a estrutura de payload varia dinamicamente demais (e.g., mensagens Kafka serializadas dinamicamente) podem gerar documentação inconsistente. Nesses casos, pode ser melhor criar definições OpenAPI manualmente em arquivos YAML ou JSON.

---

## 6. Componentes Chave Associados

### 6.1. springdoc-openapi-starter-webmvc-ui

- **O que faz?**
    - Integração “starter” que registra automaticamente:
        1. Um *bean* `OpenAPIResource` para gerar JSON no endpoint `/v3/api-docs`.
        2. A configuração do Swagger UI (arquivos estáticos, CSS, JS) em `/swagger-ui.html`.
        3. Integração com anotações Swagger/OpenAPI para gerar metadados.
- **Principais classes/artefatos incluídos**:
    - `SpringDocConfiguration` (Configuração principal).
    - `OpenAPIWebMvcResource` (expõe `/v3/api-docs`).
    - `SwaggerConfigProperties` (lê propriedades prefixadas por `springdoc.swagger-ui.*`).

### 6.2. Anotações Principais

1. **@OpenAPIDefinition**
    - Pode ser aplicada em alguma classe de configuração para fornecer informações globais (título da API, descrição, versão, servidor padrão, etc.).
    - Exemplo:
        
        ```java
        @OpenAPIDefinition(
            info = @Info(
                title = "API de Exemplo",
                version = "1.0.0",
                description = "Documentação da API de Exemplo"
            ),
            servers = @Server(url = "http://localhost:8080", description = "Servidor Local")
        )
        @Configuration
        public class OpenApiConfig {
            // Configurações adicionais (se necessário)
        }
        
        ```
        
2. **@Operation**
    - Descreve operações HTTP individuais.
    - Atributos:
        - `summary`: breve descrição.
        - `description`: detalhamento completo.
        - `tags`: categorias (string[]).
        - `security`: requisitos (e.g., `{ @SecurityRequirement(name="bearer-jwt") }`).
3. **@Parameter**
    - Documenta parâmetros explicitamente (path, query, header, cookie).
    - Exemplo:
        
        ```java
        @GetMapping("/clientes/{id}")
        @Operation(summary = "Busca cliente por ID")
        public ResponseEntity<Cliente> getCliente(
            @Parameter(description = "ID do cliente", required = true)
            @PathVariable Long id
        ) { ... }
        
        ```
        
4. **@Schema**
    - Anotações em classes de modelo ou atributos para controlar detalhes do JSON Schema gerado:
        - `description`: texto explicativo.
        - `example`: valor de exemplo.
        - `required`: define obrigatoriedade (métodos de validação do Bean Validation já ajudam nessa inferência).
        - `format`: (e.g., `"date"`, `"date-time"`, `"email"`).
    - Exemplo:
        
        ```java
        public class Cliente {
            @Schema(description="ID único gerado pelo sistema", example="100")
            private Long id;
        
            @Schema(description="Nome completo do cliente", example="João Silva")
            private String nome;
        }
        
        ```
        
5. **@Tag**
    - Agrupa endpoints logicamente sob um nome.
    - Exemplo:
        
        ```java
        @Tag(name="Pedidos", description="Operações sobre pedidos de venda")
        @RestController
        @RequestMapping("/api/pedidos")
        public class PedidoController { ... }
        
        ```
        
6. **@SecurityRequirement** / **@SecurityScheme**
    - Para documentar esquemas de segurança (bearer JWT, OAuth2, API Key).
    - Exemplo básico de configuração de segurança JWT:
        
        ```java
        @SecurityScheme(
            name = "bearer-jwt",
            type = SecuritySchemeType.HTTP,
            scheme = "bearer",
            bearerFormat = "JWT"
        )
        @Configuration
        public class SecurityConfig { }
        
        ```
        
    - Depois, em cada operação ou classe:
        
        ```java
        @Operation(
            summary="Endpoint protegido",
            security = @SecurityRequirement(name="bearer-jwt")
        )
        
        ```
        

### 6.3. Classes de Configuração Complementares

- **OpenApiCustomiser**
    - *Bean* que permite personalizar o objeto `OpenAPI` após a montagem inicial.
    - Exemplo de customização do título base:
        
        ```java
        @Bean
        public OpenApiCustomiser customOpenApi() {
            return openApi -> {
                openApi.getInfo()
                       .title("API de Exemplo Personalizada")
                       .version("2.0.0");
            };
        }
        
        ```
        
- **GroupedOpenApi**
    - Permite dividir a documentação em grupos (e.g., “v1”, “v2” ou “Interno” x “Externo”).
    - Exemplo:
        
        ```java
        @Bean
        public GroupedOpenApi apiV1() {
            return GroupedOpenApi.builder()
                .group("v1")
                .pathsToMatch("/api/v1/**")
                .build();
        }
        
        ```
        

---

## 7. Melhores Práticas e Padrões de Uso

1. **Documente cada endpoint explicitamente**
    - Mesmo que o SpringDoc faça inferência automática, escrever `@Operation` e `@Parameter` melhora a legibilidade e gera descrições mais claras.
2. **Use modelos (DTOs) separados das entidades do banco**
    - Evita expor campos desnecessários ou confidenciais. Documente apenas os campos relevantes no DTO com `@Schema`.
3. **Defina exemplos (`example`) sempre que possível**
    - Dentro de `@Schema` ou até mesmo nos atributos de parâmetro (`@Parameter(example = "valor")`), isso auxilia na compreensão de formatos esperados.
4. **Versionamento de API**
    - Use `GroupedOpenApi` para manter simultaneamente versões diferentes da documentação (e.g., `/api/v1`, `/api/v2`).
    - Mapeie os endpoints adequadamente (`.pathsToMatch("/api/v1/**")` etc.).
5. **Segurança em Swagger UI**
    - Se estiver usando JWT, configure `@SecurityScheme` e adicione `persistAuthorization=true` nas propriedades para que o token permaneça salvo na UI.
    - Documente todos endpoints protegidos com `@Operation(security = {@SecurityRequirement(name="bearer-jwt")})`.
6. **Organização Lógica por Tags**
    - Agrupe as rotas de mesma responsabilidade (e.g., “Cliente”, “Produto”, “Pedidos”) com `@Tag` ou definindo `tags` em `@Operation`. Facilita a navegação no Swagger UI.
7. **Manter atualização de dependências**
    - SpringDoc evolui rapidamente para suportar mudanças no Spring Boot. Em projetos longos, revise as versões anualmente.
8. **Personalização da Swagger UI**
    - Para ajustes avançados (logos, temas, etc.), substitua os arquivos estáticos do Swagger UI no diretório `src/main/resources/static/swagger-ui` ou use `swagger-ui-config.json` para customizar.
9. **Não Expor Em Produção, se for o caso**
    - Em ambientes de produção restritos, avalie habilitar Condição de Profile (e.g., `@Profile("!prod")`) na classe de configuração para desativar o Swagger UI.

---

## 8. Exemplo Prático Completo

A seguir, um exemplo passo a passo de um projeto Spring Boot que incorpora SpringDoc (OpenAPI) e expõe um endpoint simples de gerenciamento de “Cliente”.

---

### 8.1. Estrutura do Projeto

```
meu-projeto/
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── exemplo/
│   │   │           ├── MeuProjetoApplication.java
│   │   │           ├── config/
│   │   │           │   ├── OpenApiConfig.java
│   │   │           └── controllers/
│   │   │               └── ClienteController.java
│   │   │           └── models/
│   │   │               └── ClienteDTO.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── logback-spring.xml (opcional)
│   └── test/
│       └── java/
│           └── com/exemplo/
│               └── ClienteControllerTest.java
├── pom.xml
└── README.md

```

---

### 8.2. pom.xml com Dependências

```xml
<!-- pom.xml -->
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
                             http://maven.apache.org/maven-v4_0_0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.exemplo</groupId>
    <artifactId>meu-projeto</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>meu-projeto</name>
    <description>Projeto de Exemplo com SpringDoc</description>

    <properties>
        <java.version>17</java.version>
        <spring-boot.version>3.1.0</spring-boot.version>
        <springdoc.version>2.1.0</springdoc.version>
    </properties>

    <dependencyManagement>
        <dependencies>
            <!-- Importa o BOM do Spring Boot para compatibilidade -->
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-dependencies</artifactId>
                <version>${spring-boot.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <dependencies>
        <!-- Spring Boot Starter Web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Spring Boot Validation (Bean Validation) -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- SpringDoc OpenAPI Starter (Web MVC + Swagger UI) -->
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>${springdoc.version}</version>
        </dependency>

        <!-- Anotações Swagger (opcional, mas recomendado para metadados avançados) -->
        <dependency>
            <groupId>io.swagger.core.v3</groupId>
            <artifactId>swagger-annotations</artifactId>
            <version>2.2.8</version>
        </dependency>

        <!-- Lombok (opcional) para reduzir boilerplate -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- Dependência de Testes (JUnit 5) -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

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

---

### 8.3. Configuração de Propriedades

```
# src/main/resources/application.properties

# Porta padrão do Spring Boot
server.port=8080

# Configurações do Swagger/OpenAPI
springdoc.api-docs.path=/v3/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.swagger-ui.operationsSorter=alpha
springdoc.swagger-ui.tagsSorter=alpha
springdoc.swagger-ui.persistAuthorization=true

```

---

### 8.4. Classe Principal

```java
// src/main/java/com/exemplo/MeuProjetoApplication.java
package com.exemplo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MeuProjetoApplication {
    public static void main(String[] args) {
        SpringApplication.run(MeuProjetoApplication.class, args);
    }
}

```

---

### 8.5. Configuração Global do OpenAPI (opcional)

```java
// src/main/java/com/exemplo/config/OpenApiConfig.java
package com.exemplo.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@OpenAPIDefinition(
    info = @Info(
        title = "API de Gerenciamento de Clientes",
        version = "1.0.0",
        description = "Exemplo de API RESTful documentada com SpringDoc OpenAPI"
    ),
    servers = {
        @Server(url = "http://localhost:8080", description = "Servidor Local")
    }
)
@Configuration
public class OpenApiConfig {
    // Caso deseje customizar mais, injetar OpenApiCustomiser aqui
}

```

---

### 8.6. Modelo de Dados (DTO)

```java
// src/main/java/com/exemplo/models/ClienteDTO.java
package com.exemplo.models;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO que representa os dados de um Cliente.
 */
@Schema(description = "DTO de Cliente para operações de criação e listagem")
public class ClienteDTO {

    @Schema(description = "ID único do cliente (gerado automaticamente)", example = "1")
    private Long id;

    @NotBlank(message = "O nome não pode ser vazio")
    @Size(min = 3, max = 50, message = "O nome deve ter entre 3 e 50 caracteres")
    @Schema(description = "Nome completo do cliente",
            example = "Maria da Silva",
            required = true,
            minLength = 3,
            maxLength = 50)
    private String nome;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Formato de email inválido")
    @Schema(description = "Email de contato do cliente",
            example = "maria@example.com",
            required = true,
            format = "email")
    private String email;

    // Construtor vazio (necessário para frameworks)
    public ClienteDTO() { }

    // Construtor completo
    public ClienteDTO(Long id, String nome, String email) {
        this.id = id;
        this.nome = nome;
        this.email = email;
    }

    // Getters e Setters gerados (ou via Lombok)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}

```

---

### 8.7. Controller de Exemplo

```java
// src/main/java/com/exemplo/controllers/ClienteController.java
package com.exemplo.controllers;

import com.exemplo.models.ClienteDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Controller que expõe endpoints para gerenciar Clientes.
 */
@Tag(name = "Clientes", description = "Operações CRUD para Cliente")
@Validated
@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    // Simulação de repositório em memória
    private final Map<Long, ClienteDTO> repositorio = new HashMap<>();
    private final AtomicLong contador = new AtomicLong(1);

    @Operation(
        summary = "Cria um novo cliente",
        description = "Recebe um JSON com nome e email, valida, persiste e retorna o cliente criado com ID."
    )
    @ApiResponse(responseCode = "201", description = "Cliente criado com sucesso",
        content = @Content(mediaType = "application/json",
        schema = @Schema(implementation = ClienteDTO.class)))
    @PostMapping
    public ResponseEntity<ClienteDTO> criarCliente(
        @Valid @RequestBody ClienteDTO dto
    ) {
        Long id = contador.getAndIncrement();
        ClienteDTO novo = new ClienteDTO(id, dto.getNome(), dto.getEmail());
        repositorio.put(id, novo);
        return ResponseEntity.status(HttpStatus.CREATED).body(novo);
    }

    @Operation(
        summary = "Lista todos os clientes",
        description = "Retorna uma lista de clientes cadastrados (em memória)."
    )
    @ApiResponse(responseCode = "200", description = "Lista de clientes",
        content = @Content(mediaType = "application/json",
        schema = @Schema(implementation = ClienteDTO.class)))
    @GetMapping
    public ResponseEntity<List<ClienteDTO>> listarClientes() {
        return ResponseEntity.ok(new ArrayList<>(repositorio.values()));
    }

    @Operation(
        summary = "Busca cliente por ID",
        description = "Retorna os dados do cliente correspondente ao ID informado."
    )
    @ApiResponse(responseCode = "200", description = "Cliente encontrado",
        content = @Content(mediaType = "application/json",
        schema = @Schema(implementation = ClienteDTO.class)))
    @ApiResponse(responseCode = "404", description = "Cliente não encontrado",
        content = @Content)
    @GetMapping("/{id}")
    public ResponseEntity<ClienteDTO> buscarPorId(
        @io.swagger.v3.oas.annotations.parameters.Parameter(
            description = "ID do cliente para busca",
            required = true,
            example = "1"
        )
        @PathVariable Long id
    ) {
        ClienteDTO cliente = repositorio.get(id);
        if (cliente == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(cliente);
    }

    @Operation(
        summary = "Atualiza dados de um cliente",
        description = "Recebe ID e novos dados (nome, email) para atualizar o cliente."
    )
    @ApiResponse(responseCode = "200", description = "Cliente atualizado com sucesso",
        content = @Content(mediaType = "application/json",
        schema = @Schema(implementation = ClienteDTO.class)))
    @ApiResponse(responseCode = "404", description = "Cliente não encontrado",
        content = @Content)
    @PutMapping("/{id}")
    public ResponseEntity<ClienteDTO> atualizarCliente(
        @io.swagger.v3.oas.annotations.parameters.Parameter(
            description = "ID do cliente a ser atualizado",
            required = true,
            example = "1"
        )
        @PathVariable Long id,
        @Valid @RequestBody ClienteDTO dto
    ) {
        ClienteDTO existente = repositorio.get(id);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }
        existente.setNome(dto.getNome());
        existente.setEmail(dto.getEmail());
        return ResponseEntity.ok(existente);
    }

    @Operation(
        summary = "Deleta um cliente pelo ID",
        description = "Remove o cliente correspondente ao ID informado."
    )
    @ApiResponse(responseCode = "204", description = "Cliente excluído com sucesso", content = @Content)
    @ApiResponse(responseCode = "404", description = "Cliente não encontrado", content = @Content)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarCliente(
        @io.swagger.v3.oas.annotations.parameters.Parameter(
            description = "ID do cliente a ser excluído",
            required = true,
            example = "1"
        )
        @PathVariable Long id
    ) {
        ClienteDTO existente = repositorio.remove(id);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}

```

**Detalhes dos componentes no Controller acima**:

- `@Tag(name="Clientes", ...)`: agrupa todos os métodos deste controlador sob a tag “Clientes” no Swagger UI.
- Em cada método, usa-se:
    - `@Operation(summary, description)`: define título curto (summary) e descrição mais longa (description).
    - `@Parameter(...)`: documenta explicitamente parâmetros `@PathVariable`.
    - `@ApiResponse(...)`: define respostas esperadas (código HTTP, descrição e esquema de retorno).

> Observação:
> 
> 
> Se não for necessário detalhar cada `@ApiResponse`, o SpringDoc já infere respostas automáticas baseadas em convenções (200 para `ResponseEntity.ok(...)`, 404 para retornar `ResponseEntity.notFound()` etc.). No entanto, deixar explícito ajuda a clarear respostas alternativas (400, 401, 500, etc.).
> 

---

### 8.8. Testando no Swagger UI

1. **Inicie a aplicação**
    - `mvn spring-boot:run` (ou via IDE).
    - Ao subir, verifique log  Logs iniciais geralmente indicam que os endpoints do SpringDoc foram registrados.
2. **Acesse a especificação JSON**
    - Navegue até `http://localhost:8080/v3/api-docs`
    - Você verá um JSON com o contrato completo da API no padrão OpenAPI 3.0.
3. **Acesse a interface Swagger UI**
    - No navegador, abra `http://localhost:8080/swagger-ui.html` (ou `http://localhost:8080/swagger-ui/index.html`, dependendo da versão).
    - A UI apresentará as tags (ex.: “Clientes”) e, ao expandir, mostrará cada operação com seus parâmetros, corpo de requisição, respostas possíveis e exemplos.
    - Você pode interagir: preencher campos, enviar requisições diretamente pela interface e visualizar respostas.
4. **Verifique endpoints “operacionais”**
    - Teste “Criar Cliente”:
        - POST `/api/clientes`
        - Corpo JSON de exemplo:
            
            ```json
            {
              "nome": "Ana Pereira",
              "email": "ana.pereira@example.com"
            }
            
            ```
            
        - Observe o retorno com `201 Created` e JSON do objeto criado (incluindo `id`).
    - Outros endpoints (GET, PUT, DELETE) funcionando de modo semelhante.

---

## 9. Sugestões para Aprofundamento

1. **Customização Avançada de Swagger UI**
    - Inclua um arquivo `swagger-ui-config.json` em `src/main/resources/static` para alterar temas e comportamentos (e.g., esconder “Authorize”, mudar logo).
    - Exemplo de `swagger-ui-config.json`:
        
        ```json
        {
          "docExpansion": "list",
          "operationsSorter": "method",
          "tagsSorter": "alpha",
          "defaultModelsExpandDepth": -1
        }
        
        ```
        
2. **Versão e Documentação Múltipla de API**
    - Utilize `GroupedOpenApi` para manter `/v1/api-docs` e `/v2/api-docs` simultaneamente, configurando caminhos e versões nos `@RequestMapping`.
3. **Integração com Segurança (OAuth2, JWT)**
    - Defina `@SecurityScheme` no `OpenApiConfig` para documentar requisitos de autenticação.
    - Exemplo de configuração JWT e aplicação de `@SecurityRequirement` em endpoints que exigem token.
4. **Geração de Clientes/SKD a partir do OpenAPI**
    - Use ferramentas como **OpenAPI Generator** para criar bibliotecas de clientes (Java, TypeScript, Python, etc.) a partir do JSON gerado pelo SpringDoc.
5. **Testes Automatizados de Documentação**
    - Assegure que a documentação esteja sincronizada com a API: crie testes que validem o esquema OpenAPI (usar bibliotecas como `springdoc-openapi-test` ou `swagger-request-validator`).
6. **Configurações de Deployment e Pipeline**
    - Em ambientes CI/CD, copie o JSON do `/v3/api-docs` e faça versionamento em repositório (docs versionadas).
    - Disponibilize em um subdomínio (e.g., `docs.minhaapi.com`) com cache.
7. **Comparação com Outras Abordagens**
    - Analise diferenças entre SpringDoc e Springfox (caso precise migrar projetos legados).
    - Compare com geração manual de YAML/JSON (quando usar `@Bean OpenAPI openAPI()` para construir manualmente).

---

## 10. Conclusão

Neste guia, abordamos de forma detalhada e passo a passo:

1. **Conceitos Fundamentais** sobre Swagger (OpenAPI) e SpringDoc.
2. **Configuração Inicial** com o *starter* `springdoc-openapi-starter-webmvc-ui`.
3. **Uso de Anotações** (@Operation, @Schema, @Parameter, @Tag) para enriquecer a documentação.
4. **Boas Práticas** e cenários de quando não aplicar.
5. **Exemplo Prático Completo** de um micro-serviço gerenciador de “Cliente”, incluindo código e teste via Swagger UI.
6. **Sugestões para Aprofundamento** em customizações, segurança e manutenção da documentação.

Com isso, você já está apto a incorporar de forma robusta o Swagger/OpenAPI em qualquer aplicação Spring Boot, garantindo transparência e facilidade para quem consome sua API.

---

**Bom desenvolvimento e boas documentações!**