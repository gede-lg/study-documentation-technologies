# Definição de Esquemas de Segurança (@SecurityScheme)

---

## Introdução

Em aplicações Spring Boot, a documentação automática de APIs RESTful usando OpenAPI (anteriormente conhecido como Swagger) tem se popularizado pela clareza e interatividade que oferece a desenvolvedores e consumidores de serviços. O SpringDoc é uma biblioteca que integra o Spring Boot ao padrão OpenAPI 3, gerando automaticamente a especificação baseada em anotações presentes no código.

Um dos aspectos fundamentais de qualquer API é a **segurança**: como autenticar e autorizar consumidores, quais mecanismos de token são admitidos, onde o token deve ser enviado, entre outros. O OpenAPI 3 define, dentro de sua estrutura, um objeto chamado **securitySchemes**, que descreve os tipos de autenticação utilizados. O SpringDoc provê a anotação `@SecurityScheme` para declarar, de forma centralizada e concisa, esses esquemas de segurança. A partir disso, as anotações `@SecurityRequirement` podem ser utilizadas em controllers ou métodos para indicar que determinado endpoint exige um esquema definido.

Este guia explica, de forma estruturada, desde conceitos fundamentais até exemplos práticos, como definir e utilizar `@SecurityScheme` em um projeto Spring Boot com Java.

---

## Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conseitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    1. Anotação `@SecurityScheme`: Atributos Principais
    2. Exemplos de Configuração para Diferentes Tipos de Segurança
    3. Associação com `@SecurityRequirement` em Endpoints
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## Conceitos Fundamentais

- **OpenAPI 3:** É um padrão para descrever APIs RESTful de forma legível tanto para humanos quanto para máquinas. A especificação consiste em um arquivo YAML ou JSON que detalha endpoints, métodos HTTP, parâmetros, modelos de dados e também os esquemas de segurança (securitySchemes).
- **SpringDoc:** É uma biblioteca que, integrada ao Spring Boot, lê anotações presentes em controladores (`@RestController`, `@Operation`, etc.) e gera, em tempo de execução, a especificação OpenAPI. Além disso, disponibiliza uma interface gráfica (Swagger UI) para explorar a API diretamente no navegador.
- **`securitySchemes` (OpenAPI):** Dentro do objeto raiz `components`, há uma seção `securitySchemes` onde definem-se as regras de autenticação da API. Cada esquema possui um nome (por exemplo, `"bearerAuth"`) e detalha:
    - Tipo de esquema (`type`): `http`, `apiKey`, `oauth2` ou `openIdConnect`.
    - Parâmetros específicos: como `bearerFormat`, `scheme`, localização do token (`in: header` ou `cookie`), nomes de parâmetro (`name: Authorization`), fluxos OAuth2 etc.
- **`@SecurityScheme` (SpringDoc):** Anotação fornecida por `io.swagger.v3.oas.annotations.security.SecurityScheme` usada para declarar um *security scheme* (esquema de segurança) que será incluído no arquivo OpenAPI gerado. É normalmente colocada em uma classe de configuração ou na classe principal do Spring Boot.
- **`@SecurityRequirement` (SpringDoc):** Anotação usada para relacionar um endpoint (ou todo um controlador) a um dos esquemas declarados em `@SecurityScheme`. Especifica que aquele endpoint exige autenticação conforme o esquema nomeado.

---

## Sintaxe Detalhada e Uso Prático

### 1. Anotação `@SecurityScheme`: Atributos Principais

A anotação `@SecurityScheme` permite detalhar cada esquema de segurança. Veja os atributos mais comuns:

```java
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;

@SecurityScheme(
    name = "bearerAuth",                            // Nome do esquema para referenciar
    type = SecuritySchemeType.HTTP,                  // Tipo HTTP (Bearer, Basic etc.)
    scheme = "bearer",                               // Subtipo (Bearer)
    bearerFormat = "JWT",                            // Formato (ex: JWT)
    in = SecuritySchemeIn.HEADER,                    // Local onde o token será enviado (header, cookie, query)
    description = "Token JWT para autenticação"      // Descrição opcional
)
public class SwaggerSecurityConfig { }

```

**Principais atributos de `@SecurityScheme`:**

- **`name` (obrigatório):** Identificador único do esquema. Será referenciado em `@SecurityRequirement`.
- **`type`:** Tipo geral do esquema. Valores possíveis:
    - `SecuritySchemeType.HTTP` (Basic, Bearer, Digest)
    - `SecuritySchemeType.APIKEY` (Chaves simples, onde `in` define `header`, `query` ou `cookie`)
    - `SecuritySchemeType.OAUTH2` (Fluxos OAuth2)
    - `SecuritySchemeType.OPENIDCONNECT` (URI do OpenID Connect)
- **`scheme`:** (quando `type=HTTP`) Especifica o sub-tipo, por exemplo, `"basic"` ou `"bearer"`.
- **`bearerFormat`:** (com `type=HTTP` e `scheme="bearer"`) Indica o formato do token, usualmente `"JWT"`.
- **`in`:** (quando `type=APIKEY`) Define onde a chave deve ser enviada: `HEADER`, `QUERY` ou `COOKIE`.
- **`name`:** (quando `type=APIKEY`) O nome do cabeçalho, parâmetro de consulta ou cookie.
- **`flows`:** (quando `type=OAUTH2`) Objeto que detalha os fluxos de autorização (Authorization Code, Implicit, Password, Client Credentials).
- **`openIdConnectUrl`:** (quando `type=OPENIDCONNECT`) URL para descoberta automática do OpenID.

### 2. Exemplos de Configuração para Diferentes Tipos de Segurança

---

### 2.1 HTTP Bearer (JWT)

```java
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
@SecurityScheme(
    name = "bearerAuth",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT",
    in = SecuritySchemeIn.HEADER,
    description = "Utilize o token JWT no cabeçalho Authorization: Bearer <token>"
)
public class SwaggerSecurityConfig { }

```

- **Explicação:**
    1. `type = HTTP` e `scheme = "bearer"` configuram que o esquema é Bearer Token.
    2. `bearerFormat = "JWT"` sugere que o token é JWT, mas não é validado pelo SpringDoc—apenas informativo para o consumidor da API.
    3. `in = HEADER` e `name = "Authorization"` (padrão para Bearer) indicam onde o token será enviado.

Após declarar esse esquema, é possível aplicá-lo nos endpoints:

```java
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UsuarioController {

    @Operation(
        summary = "Retorna dados do usuário autenticado",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @GetMapping("/api/usuarios/me")
    public ResponseEntity<UsuarioDTO> getUsuarioLogado() {
        // lógica para retornar usuário
    }
}

```

- **Explicação:**
    - A anotação `@Operation(..., security = @SecurityRequirement(name = "bearerAuth"))` indica ao SpringDoc que este endpoint exige autenticação via o esquema “bearerAuth” previamente declarado.

---

### 2.2 API Key no Header

```java
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
@SecurityScheme(
    name = "apiKeyAuth",
    type = SecuritySchemeType.APIKEY,
    in = SecuritySchemeIn.HEADER,
    paramName = "X-API-KEY",
    description = "Chave de API enviada no cabeçalho X-API-KEY"
)
public class SwaggerSecurityConfig { }

```

- **Explicação:**
    1. `type = APIKEY` e `in = HEADER` significam que a chave será enviada no cabeçalho HTTP.
    2. `paramName = "X-API-KEY"` define o nome do cabeçalho.
    3. No endpoint, anexa-se a exigência:
        
        ```java
        @Operation(security = @SecurityRequirement(name = "apiKeyAuth"))
        @GetMapping("/api/recursos")
        public ResponseEntity<List<RecursoDTO>> listarRecursos() { … }
        
        ```
        

---

### 2.3 OAuth2 (Fluxo Client Credentials, Authorization Code etc.)

```java
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.OAuthFlow;
import io.swagger.v3.oas.annotations.security.OAuthFlows;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
@SecurityScheme(
    name = "oauth2Scheme",
    type = SecuritySchemeType.OAUTH2,
    flows = @OAuthFlows(
        authorizationCode = @OAuthFlow(
            authorizationUrl = "https://auth-server.com/oauth/authorize",
            tokenUrl = "https://auth-server.com/oauth/token",
            scopes = {
                @io.swagger.v3.oas.annotations.security.OAuthScope(name = "read", description = "Acesso de leitura"),
                @io.swagger.v3.oas.annotations.security.OAuthScope(name = "write", description = "Acesso de escrita")
            }
        )
    )
)
public class SwaggerSecurityConfig { }

```

- **Explicação:**
    1. `type = OAUTH2` informa que o esquema é OAuth2.
    2. `flows = @OAuthFlows(...)` detalha quais fluxos estão disponíveis – aqui, apenas `authorizationCode`.
    3. `authorizationUrl` e `tokenUrl` devem apontar para os endpoints do servidor de autorização (Authorization Server).
    4. `scopes` definem permissões específicas que o cliente pode solicitar.
    5. Para exigir esse esquema em endpoints:
        
        ```java
        @Operation(
            summary = "Cria um recurso protegido",
            security = @SecurityRequirement(name = "oauth2Scheme", scopes = {"write"})
        )
        @PostMapping("/api/recursos")
        public ResponseEntity<RecursoDTO> criarRecurso(@RequestBody RecursoForm form) { … }
        
        ```
        

---

### 3. Associação com `@SecurityRequirement` em Endpoints

- **Em nível de classe (todos os métodos herdam o requisito):**
    
    ```java
    @RestController
    @RequestMapping("/api/protegido")
    @SecurityRequirement(name = "bearerAuth")
    public class ProtegidoController {
        @GetMapping("/dados")
        public ResponseEntity<?> dadosProtegidos() { … }
    
        @PostMapping("/acao")
        public ResponseEntity<?> realizarAcao() { … }
    }
    
    ```
    
    Todos os métodos de `ProtegidoController` exigirão o esquema “bearerAuth”.
    
- **Em nível de método (individual):**
    
    ```java
    @RestController
    @RequestMapping("/api/misto")
    public class MistoController {
    
        @GetMapping("/publico")
        public ResponseEntity<?> publico() {
            // Sem autenticação
        }
    
        @Operation(security = @SecurityRequirement(name = "bearerAuth"))
        @GetMapping("/privado")
        public ResponseEntity<?> privado() {
            // Exige autenticação
        }
    }
    
    ```
    

---

## Cenários de Restrição ou Não Aplicação

1. **APIs Internas / Sem Segurança Exposta:**
    - Caso a API seja estritamente interna a um ambiente controlado (intranet, microserviços entre si), muitas vezes a exposição de esquemas de segurança no Swagger pode não ser necessária ou pode gerar ruído.
2. **Autenticação Customizada Não Compatível com Padrões OpenAPI:**
    - Se o projeto utiliza um esquema de autenticação altamente customizado (por exemplo, múltiplos cabeçalhos cifrados, tokens gerados de forma proprietária sem seguir Bearer/API Key/OAuth2), pode ser difícil mapear isso diretamente a um `securityScheme` oficial. Nesses casos, recomenda-se criar uma seção “Security” genérica na descrição, sem usar `@SecurityScheme`.
3. **Projeto Muito Simples (Protótipo):**
    - Em protótipos rápidos ou aplicações de escopo mínimo, expor toda a configuração de segurança pode tornar a documentação mais complexa do que o necessário. Neste cenário, muitas vezes documenta-se manualmente no README ou numa página HTML estática, sem depender do OpenAPI.
4. **Ambientes com Política Estrita de Documentação (Ex: Governança de APIs que não permite expor a estrutura interna de segurança):**
    - Se, por questão de governança ou compliance, a equipe não quer expor detalhes de seus esquemas de autenticação, pode-se omitir essa parte no Swagger, documentando externamente ou em repositórios restritos.

---

## Componentes Chave Associados

1. **Anotações Principais:**
    - `@SecurityScheme` (de `io.swagger.v3.oas.annotations.security`): Define um esquema de segurança global.
    - `@SecurityRequirement` (de `io.swagger.v3.oas.annotations.security`): Indica que determinado método ou classe exige o esquema nomeado.
    - `@Operation` (de `io.swagger.v3.oas.annotations`): Serve para complementar a documentação de cada operação (endpoint); recebe `security` como atributo.
2. **Classes de Configuração (Spring Boot):**
    - Qualquer classe anotada com `@Configuration` (ou mesmo a classe principal da aplicação) pode receber `@SecurityScheme`.
    - Em projetos mais sofisticados, utiliza-se uma classe específica para agrupar configurações do OpenAPI, por exemplo:
        
        ```java
        @Configuration
        @OpenAPIDefinition(
            info = @Info(title="Minha API", version="v1", description="Documentação OpenAPI"),
            servers = @Server(url = "http://localhost:8080")
        )
        @SecurityScheme(... configurações ...)
        public class OpenApiConfig { }
        
        ```
        
    - `@OpenAPIDefinition`: Permite configurar informações globais como `info`, `servers`, `tags`, `security` padrão etc.
3. **Modelos (Classes Java) e Esquemas de Dados:**
    - As classes DTO/Entidades anotadas com `@Schema` ou `@Schema(description="...")` são refletidas nos modelos do OpenAPI.
    - Não relacionadas diretamente a `@SecurityScheme`, mas compõem a especificação final.
4. **Classes da Biblioteca SpringDoc:**
    - `org.springdoc.core.GroupedOpenApi`: Permite agrupar endpoints em diferentes grupos (por exemplo, “público” vs. “admin”), cada grupo podendo ter esquemas de segurança distintos.
    - `org.springdoc.core.providers.ObjectMapperProvider`: Utilizada internamente para gerar os modelos de esquema.
5. **Dependências Necessárias:**
    - No `pom.xml` (Maven) ou `build.gradle` (Gradle), deve constar, ao mínimo:
        
        ```xml
        <!-- SpringDoc OpenAPI UI -->
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-ui</artifactId>
            <version>1.7.0</version> <!-- Verificar versão mais recente -->
        </dependency>
        <!-- Se estiver usando Spring Security -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        
        ```
        
    - A biblioteca `springdoc-openapi-ui` traz o Swagger UI embutido em `/swagger-ui.html` ou `/swagger-ui/index.html`.

---

## Melhores Práticas e Padrões de Uso

1. **Definir Esquemas de Segurança em Uma Única Classe de Configuração:**
    - Centralize todas as anotações `@SecurityScheme` em uma classe (ex.: `OpenApiConfig` ou `SwaggerSecurityConfig`). Isso facilita manutenção e evita duplicação.
2. **Nomeclatura Consistente:**
    - Utilize nomes autoexplicativos (ex.: `"bearerAuth"`, `"apiKeyAuth"`, `"oauth2ClientCredentials"`).
    - Mantenha os mesmos nomes em `@SecurityRequirement` para evitar erros de digitação.
3. **Separação de Grupos (Opcional):**
    - Se sua API possui endpoints públicos e privados, crie dois grupos de OpenAPI:
        
        ```java
        @Bean
        public GroupedOpenApi publicApi() {
            return GroupedOpenApi.builder()
                .group("público")
                .packagesToScan("com.minhaempresa.api.publico")
                .build();
        }
        
        @Bean
        public GroupedOpenApi privateApi() {
            return GroupedOpenApi.builder()
                .group("privado")
                .packagesToScan("com.minhaempresa.api.privado")
                .addOpenApiCustomiser(openApi -> {
                    openApi.getComponents().addSecuritySchemes("bearerAuth",
                        new SecurityScheme().type(SecurityScheme.Type.HTTP)
                                            .scheme("bearer")
                                            .bearerFormat("JWT"));
                    openApi.addSecurityItem(new SecurityRequirement().addList("bearerAuth"));
                })
                .build();
        }
        
        ```
        
    - Assim, você exibe apenas o que for relevante em cada grupo.
4. **Documentar Escopos (OAuth2) e Autorizações Específicas:**
    - Caso utilize OAuth2, detalhe claramente cada escopo (`scope`) para que, ao usuário interagir no Swagger UI, ele saiba exatamente quais permissões estão envolvidas.
5. **Comentários em Código e Descrições Claras:**
    - Use `description` nos atributos da anotação para fornecer orientações ao consumidor (por exemplo, “Envie: Authorization: Bearer ”).
6. **Versionamento e Atualização de Esquemas:**
    - Ao evoluir a API, mantenha versões e, se necessário, crie novos esquemas (ex.: “bearerAuthV2”) para compatibilidade retroativa.
7. **Evitar Exposição Indevida de Endpoints Internos:**
    - Se existir algum endpoint exclusivamente interno (sem necessidade de documentação externa), isole-o em pacote não incluído no scan do SpringDoc ou marque com `@Hidden`.
8. **Conformidade com a Política de Segurança:**
    - Verifique se as informações exibidas no Swagger não comprometem segredos (URLs internas, detalhes sensíveis).
    - Lembre-se que, ao publicar a interface do Swagger UI, qualquer pessoa poderá ver a definição do `securityScheme`, embora não consiga obter o token em si.

---

## Exemplo Prático Completo

A seguir, um projeto simplificado que demonstra passo a passo a definição e consumo de um esquema de segurança Bearer JWT usando SpringDoc.

### 1. Estrutura de Diretórios (resumida)

```
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com/exemplo/api
│   │   │       ├── Application.java
│   │   │       ├── config
│   │   │       │   └── OpenApiConfig.java
│   │   │       ├── controller
│   │   │       │   ├── AuthController.java
│   │   │       │   └── UsuarioController.java
│   │   │       └── security
│   │   │           ├── JwtAuthenticationFilter.java
│   │   │           ├── JwtTokenProvider.java
│   │   │           └── SecurityConfig.java
│   │   └── resources
│   │       └── application.properties
└── pom.xml

```

---

### 2. Dependências (`pom.xml`)

```xml
<dependencies>
    <!-- Spring Boot Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- Spring Boot Security -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>

    <!-- JWT (jjwt) -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>

    <!-- SpringDoc OpenAPI UI -->
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-ui</artifactId>
        <version>1.7.0</version>
    </dependency>
</dependencies>

```

---

### 3. Arquivo de Configuração do Spring (Application.java)

```java
package com.exemplo.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

```

---

### 4. Configuração do OpenAPI com `@SecurityScheme` (OpenApiConfig.java)

```java
package com.exemplo.api.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "API de Exemplo",
        version = "v1",
        description = "API demonstrando Swagger via SpringDoc com autenticação JWT"
    ),
    servers = {
        @Server(url = "http://localhost:8080", description = "Servidor Local")
    }
)
@SecurityScheme(
    name = "bearerAuth",                          // Referenciado em @SecurityRequirement
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT",
    in = SecuritySchemeIn.HEADER,
    description = "Insira o token JWT no cabeçalho: Authorization: Bearer <token>"
)
public class OpenApiConfig {
    // Esta classe agrupa definições gerais do OpenAPI e esquemas de segurança
}

```

---

### 5. Configuração de Segurança (SecurityConfig.java)

```java
package com.exemplo.api.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeHttpRequests()
                .requestMatchers("/api/auth/**").permitAll()   // Endpoints de login/registro são públicos
                .requestMatchers(HttpMethod.GET, "/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                // Permitir acesso ao Swagger sem autenticação
                .anyRequest().authenticated()   // Demais endpoints exigem autenticação
            .and()
            .addFilterBefore(jwtAuthenticationFilter,
                             org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}

```

- **Explicação:**
    1. Desativa `csrf` (para APIs REST).
    2. `SessionCreationPolicy.STATELESS` porque a autenticação se dará via JWT, sem sessão HTTP.
    3. Permite `/api/auth/**` (login e registro) sem autenticação.
    4. Permite acesso ao Swagger UI e arquivos OpenAPI sem token.
    5. Exige autenticação para qualquer outra rota e injeta o filtro `JwtAuthenticationFilter` antes do processamento do `UsernamePasswordAuthenticationFilter`.

---

### 6. Provedor de Token JWT (JwtTokenProvider.java)

```java
package com.exemplo.api.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${security.jwt.secret-key}")
    private String secretKey;         // Chave secreta para assinar tokens (base64 ou texto simples)

    @Value("${security.jwt.expiration-ms}")
    private long validityInMilliseconds; // Tempo de expiração em milissegundos

    private Key key;

    @PostConstruct
    protected void init() {
        // Inicializar objeto Key a partir da chave secreta (ex.: Bytes do secretKey)
        this.key = Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    public String generateToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + validityInMilliseconds);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
                   .setSigningKey(key)
                   .build()
                   .parseClaimsJws(token)
                   .getBody()
                   .getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            // Token inválido ou expirado
        }
        return false;
    }
}

```

- **Explicação:**
    1. A chave secreta e validade são carregadas de `application.properties`.
    2. `generateToken(...)` cria um JWT com `subject = username`.
    3. `validateToken(...)` verifica assinatura e expiração.

---

### 7. Filtro de Autenticação JWT (JwtAuthenticationFilter.java)

```java
package com.exemplo.api.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtTokenProvider tokenProvider,
                                   CustomUserDetailsService userDetailsService) {
        this.tokenProvider = tokenProvider;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        String token = getTokenFromRequest(request);

        if (StringUtils.hasText(token) && tokenProvider.validateToken(token)) {
            String username = tokenProvider.getUsernameFromToken(token);
            var userDetails = userDetailsService.loadUserByUsername(username);

            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities()
            );
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }
}

```

- **Explicação:**
    1. Extrai o token JWT de `Authorization: Bearer <token>`.
    2. Valida, obtém `username` e carrega usuário do banco (via `CustomUserDetailsService`).
    3. Popula o `SecurityContext` para que Spring Security considere o usuário autenticado.

---

### 8. Endpoints de Autenticação (AuthController.java)

```java
package com.exemplo.api.controller;

import com.exemplo.api.security.JwtTokenProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginData.get("username"),
                    loginData.get("password")
                )
            );
            String token = tokenProvider.generateToken(authentication.getName());
            return ResponseEntity.ok(Map.of("token", token));
        } catch (AuthenticationException ex) {
            return ResponseEntity.status(401).body("Credenciais inválidas");
        }
    }
}

```

- **Explicação:**
    1. Cliente envia objeto JSON `{ "username": "...", "password": "..." }`.
    2. `AuthenticationManager` tenta autenticar. Se válido, gera JWT e devolve `{ "token": "..." }`.

---

### 9. Controller Protegido (UsuarioController.java)

```java
package com.exemplo.api.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Operation(
        summary = "Retorna informações do usuário logado",
        description = "Endpoint que retorna detalhes básicos do usuário autenticado",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @GetMapping("/me")
    public ResponseEntity<?> getUsuarioLogado() {
        // Lógica para obter dados do usuário via SecurityContext
        // Exemplo fictício:
        Map<String, String> usuario = Map.of(
            "username", "usuarioExemplo",
            "email", "usuario@exemplo.com"
        );
        return ResponseEntity.ok(usuario);
    }
}

```

- **Explicação:**
    - `@Operation(security = @SecurityRequirement(name = "bearerAuth"))` faz com que, no Swagger UI, seja exibido o botão “Authorize” que solicita o token para acessar este endpoint.

---

### 10. `application.properties` (Configurações JWT e SpringDoc)

```
# Porta
server.port=8080

# JWT
security.jwt.secret-key=MinhaChaveSuperSecretaQuePrecisaTerPeloMenos32Bytes
security.jwt.expiration-ms=3600000  # 1 hora

# SpringDoc
springdoc.api-docs.path=/v3/api-docs
springdoc.swagger-ui.path=/swagger-ui.html

```

---

### 11. Testando no Swagger UI

1. Inicie a aplicação (`mvn spring-boot:run`).
2. Acesse `http://localhost:8080/swagger-ui.html`.
3. Clique no botão **Authorize** (canto superior direito).
4. Insira no campo `bearerAuth` o token JWT (por exemplo, `eyJhbGciOiJIUzI1NiIsInR5cCI6...`).
5. Após autorizado, todas as chamadas para endpoints protegidos exibirão “200 OK” (se o token for válido).

---

## Sugestões para Aprofundamento

- **Documentação Oficial SpringDoc:**
    - [https://springdoc.org/](https://springdoc.org/)
- **Especificação OpenAPI 3 (Security Schemes):**
    - [https://spec.openapis.org/oas/v3.1.0#security-scheme-object](https://spec.openapis.org/oas/v3.1.0#security-scheme-object)
- **Artigos e Tutoriais:**
    - *“Spring Boot, Spring Security e JWT – Exemplo Completo”* (diversos blogs especializados em Java e Spring)
    - *“Configuring OAuth2 with SpringDoc”* – para quem deseja explorar fluxos OAuth2 mais avançados.
- **Referências de Boas Práticas de Segurança:**
    - OWASP REST Security Cheat Sheet ([https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html))
    - Gap analysis entre OpenAPI e necessidades específicas de segurança da sua organização.

---

> Observação Final:
> 
> 
> A anotação `@SecurityScheme`, aliada a `@SecurityRequirement`, oferece uma forma simples e declarativa de documentar esquemas de autenticação no Swagger UI, proporcionando a consumidores da API uma interface gráfica amigável para testar endpoints protegidos. Ao integrar corretamente com Spring Security e filtros JWT, garante-se que o comportamento documentado reflita o comportamento real da aplicação, evitando desencontros entre a documentação e a implementação prática.
>