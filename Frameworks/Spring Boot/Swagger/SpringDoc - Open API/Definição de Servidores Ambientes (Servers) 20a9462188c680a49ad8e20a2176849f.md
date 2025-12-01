# Definição de Servidores/Ambientes (Servers)

---

## Introdução

O **SpringDoc** é uma biblioteca que integra automaticamente o **OpenAPI 3** (antigo Swagger) em aplicações Spring Boot, gerando documentação interativa e úteis arquivos JSON/YAML para suas APIs RESTful. Um dos aspectos fundamentais dessa documentação é a definição de **servidores** (ou ambientes) onde a API estará disponível (por exemplo, desenvolvimento, homologação, produção). Esse recurso permite que consumidores da API (desenvolvedores front-end, times de QA, integradores) escolham facilmente em qual URL apontar suas requisições, sem alterar manualmente o código-fonte.

Nesta explicação, abordaremos desde conceitos básicos — o que é OpenAPI/Swagger e SpringDoc — até exemplos práticos de como configurar múltiplos servidores no seu projeto Spring Boot.

---

## Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#conceitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sintaxe-detalhada-e-uso-pr%C3%A1tico)
    1. [Dependências e Configuração Inicial](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#depend%C3%AAncias-e-configura%C3%A7%C3%A3o-inicial)
    2. [Anotação `@OpenAPIDefinition` com `@Server`](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#anota%C3%A7%C3%A3o-openapidefinition-com-server)
    3. [Configuração via `application.yaml` ou `application.properties`](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#configura%C3%A7%C3%A3o-via-applicationyaml-ou-applicationproperties)
    4. [Uso de Perfis (Spring Profiles) para Ambientes Diferentes](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#uso-de-perfis-spring-profiles-para-ambientes-diferentes)
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes-Chave Associados](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#componentes-chave-associados)
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#exemplo-pr%C3%A1tico-completo)
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6840f1f3-77c8-8013-a875-660be37d61b4#sugest%C3%B5es-para-aprofundamento)

---

## Conceitos Fundamentais

### O que é OpenAPI/Swagger?

- **OpenAPI Specification (OAS)**: um padrão aberto para descrever APIs RESTful em formato JSON ou YAML, facilitando a comunicação clara entre fornecedores e consumidores de serviços.
- **Swagger**: antigamente, o nome dado ao ecossistema de ferramentas para OAS. Hoje, o termo “Swagger” costuma ser usado de forma genérica para “documentação interativa” e geração de cliente/servidor a partir de especificações.

### O que é SpringDoc?

- **SpringDoc** (ou **springdoc-openapi**) é uma biblioteca que, de modo transparente, analisa suas controllers, anotações (`@RestController`, `@GetMapping`, `@Parameter`, etc.) e gera automaticamente uma definição OpenAPI 3 no endpoint `/v3/api-docs` (JSON) ou `/v3/api-docs.yaml`. Além disso, disponibiliza a interface gráfica do **Swagger UI** em `/swagger-ui.html` ou `/swagger-ui/index.html` para exploração interativa.

### Por que Definir Servidores?

- **Ambientes Diferentes**: em geral, há pelo menos três servidores distintos onde sua aplicação pode ser executada:
    1. **Desenvolvimento (Dev)** – `http://localhost:8080`
    2. **Homologação/Testes (QA)** – `https://qa.minhaapi.com`
    3. **Produção (Prod)** – `https://api.minhaapi.com`
- Ao configurar a seção `servers` na especificação OpenAPI, a interface do Swagger UI passa a exibir um menu suspenso (“Select a server”) permitindo ao usuário escolher em qual URL base deseja executar as requisições diretamente pela documentação.
- Isso elimina a necessidade de editar URLs de forma manual em cada requisição de teste e mantém um único ponto de referência para todos os ambientes.

---

## Sintaxe Detalhada e Uso Prático

### Dependências e Configuração Inicial

1. **Adicione a dependência do SpringDoc** no seu `pom.xml` (Maven) ou `build.gradle` (Gradle).
    
    ```xml
    <!-- pom.xml -->
    <dependency>
      <groupId>org.springdoc</groupId>
      <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
      <version>2.1.0</version>
    </dependency>
    
    ```
    
    ```groovy
    // build.gradle
    implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.1.0'
    
    ```
    
    - Essa dependência traz automaticamente:
        - Geração de JSON/YAML do OpenAPI em `/v3/api-docs`
        - Swagger UI em `/swagger-ui.html` ou `/swagger-ui/index.html`
2. **Ative o SpringDoc** se necessário (geralmente não é preciso nenhuma configuração extra; o starter já detecta automaticamente as controllers).

---

### Anotação `@OpenAPIDefinition` com `@Server`

Para definir servidores de forma estática via código, você utiliza a anotação `@OpenAPIDefinition` acima da sua classe principal (ou de uma classe de configuração) e inclui o atributo `servers`:

```java
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@OpenAPIDefinition(
    info = @Info(
        title = "Minha API de Exemplo",
        version = "1.0.0",
        description = "Documentação da API usando SpringDoc com multiple servers"
    ),
    servers = {
        @Server(url = "http://localhost:8080", description = "Servidor Local (Dev)"),
        @Server(url = "https://qa.minhaapi.com", description = "Homologação (QA)"),
        @Server(url = "https://api.minhaapi.com", description = "Produção (Prod)")
    }
)
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

```

**Explicação dos elementos acima:**

- `@OpenAPIDefinition`: anotação de nível global para definir metadados do OpenAPI.
- `info = @Info(...)`: define título, versão e descrição da documentação.
- `servers = { @Server(...), @Server(...), ... }`: lista de servidores, cada um com:
    - `url`: URL base do ambiente (pode incluir `{variáveis}` se necessário)
    - `description`: texto para identificação no Swagger UI

**Variações possíveis:**

- Definir apenas um servidor (ex.: para aplicações que não usam múltiplos estágios).
- Usar variáveis de ambiente ou Spring Profiles para alterar programaticamente a URL.

---

### Configuração via `application.yaml` ou `application.properties`

Além da abordagem por anotação, o SpringDoc também suporta a definição de servidores diretamente em propriedades, o que é útil para evitar recompilar a aplicação ao alterar URLs.

### Exemplo em `application.yaml`:

```yaml
springdoc:
  api-docs:
    path: /v3/api-docs
  swagger-ui:
    # Lista de URLs de documentação para múltiplos ambientes
    urls:
      - name: Dev
        url: http://localhost:8080/v3/api-docs
      - name: QA
        url: https://qa.minhaapi.com/v3/api-docs
      - name: Prod
        url: https://api.minhaapi.com/v3/api-docs

```

- **Observação:** Essa configuração controla apenas quais "fontes de documentação" o Swagger UI carrega, não altera diretamente o campo `servers` no JSON OpenAPI em `/v3/api-docs`. No entanto, ao clicar no menu suspenso “Available definitions”, o usuário escolhe qual endpoint `v3/api-docs` carregar.

### Exemplo em `application.properties`:

```
# Caminho padrão para geração do OpenAPI (pode deixar o padrão /v3/api-docs)
springdoc.api-docs.path=/v3/api-docs

# Lista de URLs disponíveis para o Swagger UI
springdoc.swagger-ui.urls[0].name=Dev
springdoc.swagger-ui.urls[0].url=http://localhost:8080/v3/api-docs

springdoc.swagger-ui.urls[1].name=QA
springdoc.swagger-ui.urls[1].url=https://qa.minhaapi.com/v3/api-docs

springdoc.swagger-ui.urls[2].name=Prod
springdoc.swagger-ui.urls[2].url=https://api.minhaapi.com/v3/api-docs

```

---

### Uso de Perfis (Spring Profiles) para Ambientes Diferentes

Frequentemente, você terá propriedades específicas para cada ambiente (por exemplo, `application-dev.yaml`, `application-qa.yaml`, `application-prod.yaml`). Basta definir o `@OpenAPIDefinition` de forma genérica e, se preferir, usar variações via `@Value("${...}")` ou `Environment` para preencher dinamicamente a lista de servidores.

### Exemplo de injeção dinâmica de URLs por Profile:

```yaml
# application-dev.yaml
api:
  server:
    url: http://localhost:8080
    desc: "Servidor Local (Dev)"

```

```yaml
# application-prod.yaml
api:
  server:
    url: https://api.minhaapi.com
    desc: "Produção (Prod)"

```

```java
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(title = "Minha API Dinâmica", version = "1.0.0"),
    servers = {
        @Server(url = "${api.server.url}", description = "${api.server.desc}")
    }
)
public class OpenApiConfig {
    // A injeção via @Value fará com que Spring resolva a url/descriptions de acordo com o profile ativo
}

```

- Ao iniciar a aplicação com `Dspring.profiles.active=dev`, o servidor definido será `http://localhost:8080`.
- Com `Dspring.profiles.active=prod`, o servidor passa a ser `https://api.minhaapi.com`.

---

## Cenários de Restrição ou Não Aplicação

1. **APIs Internas Sem Necessidade de Documentação Externa**
    - Se sua API for estritamente interna (acessada apenas por componentes backend e não consumida por equipes externas), talvez não seja necessário definir múltiplos servidores via OpenAPI.
2. **Ambientes Dinâmicos ou Descoberta de Serviços**
    - Em arquiteturas de microsserviços com **Service Discovery** (Eureka, Consul) e URLs dinâmicas, pode não fazer sentido “hardcodear” uma lista de servidores na documentação, pois os endereços flutuam. Neste caso, a recomendação é expor apenas o conceito “base URL” genérico e documentar em texto que o serviço é descoberto via DNS ou service registry.
3. **Soluções Alternativas**
    - Se já houver um gateway (por exemplo, Zuul, Spring Cloud Gateway) que unifique todas as rotas de ambiente, a documentação pode se referir sempre ao gateway (`https://api-gateway.minhaempresa.com`) em vez dos servidores individuais.

---

## Componentes-Chave Associados

### Anotações Principais

- `@OpenAPIDefinition`: Define metadados globais para a especificação OpenAPI, suportando atributos como `info`, `servers`, `tags` e `components`.
- `@Server`: Representa um servidor em um documento OpenAPI. Parâmetros:
    - `url`: a URL base (pode conter variáveis, por exemplo, `https://{host}:{port}/api`).
    - `description`: descrição breve do servidor.
    - `variables`: (opcional) define variáveis de servidor (com valores padrão e enumerações).
- `@Info`: Metadados da API (título, versão, descrição, termos de uso, contato, licença).
- `@SecurityScheme`, `@Tag`, `@Contact`: outros componentes que podem coexistir com `@OpenAPIDefinition`, mas não são específicos de servidores.

### Classes e Beans Importantes

- `org.springdoc.core.SpringDocUtils`: ferramenta interna para customização de tipos resolvidos pela biblioteca.
- `org.springdoc.core.GroupedOpenApi`: permite agrupar controllers/tags e criar múltiplas especificações (por exemplo, “v1”, “v2”).

### Propriedades que Controlam o Swagger UI

- `springdoc.api-docs.path`: define onde o JSON gerado estará disponível (padrão `/v3/api-docs`).
- `springdoc.swagger-ui.path`: local da interface gráfica (padrão `/swagger-ui.html` ou `/swagger-ui/index.html`).
- `springdoc.swagger-ui.urls`: lista de fontes de documentação para múltiplos ambientes.

---

## Melhores Práticas e Padrões de Uso

1. **Não Hardcodear URLs de Produção em Código-Fonte**
    - Prefira usar variáveis de ambiente ou perfis do Spring para definir `@Server(url="${api.server.url}")`. Evita expor endpoints de produção em repositórios públicos.
2. **Manter a Documentação Sincronizada com o Código**
    - Toda vez que você criar ou alterar controllers, garanta que as anotações (`@Operation`, `@ApiResponse`, etc.) estejam corretas, permitindo que a documentação reflita as rotas e esquemas de entrada/saída corretamente.
3. **Agrupar Controllers em Specs Separadas (quando necessário)**
    - Se você tiver versões distintas da API (por exemplo, `/v1/**` e `/v2/**`), use `GroupedOpenApi` para gerar arquivos separados, cada um com seus próprios servidores ou escopo.
4. **Usar Variáveis de Servidor para Recursos Dinâmicos**
    - Exemplo:
        
        ```java
        @Server(
          url = "https://{subdomain}.minhaapi.com:{port}/api",
          description = "Servidor com variáveis",
          variables = {
            @ServerVariable(name = "subdomain", defaultValue = "api", allowableValues = {"api","qa","dev"}),
            @ServerVariable(name = "port", defaultValue = "443", allowableValues = {"443","8443"})
          }
        )
        
        ```
        
    - Permite que consumidores escolham configurações de host/port diretamente no Swagger UI.
5. **Definir Sempre a Versão da API**
    - No `@Info`, inclua `version = "1.2.3"` ou similar. Ajuda a distinguir endpoints e backward compatibility.
6. **Documentar Erros/Padrões de Resposta Consistentes**
    - Utilize `@ApiResponses` e `@ApiResponse` para que, ao alternar servidores, o usuário visualize exemplos de retorno de erro de forma consistente.

---

## Exemplo Prático Completo

A seguir, um exemplo “minimalista” de projeto Spring Boot que mostra:

1. Dependência no `pom.xml`
2. Definição de servidores via `@OpenAPIDefinition` com variáveis de ambiente (Profiles)
3. Controller de exemplo e como acessar o Swagger UI

---

### 1. `pom.xml` (apenas as partes relevantes)

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" ...>
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.exemplo</groupId>
  <artifactId>api-springdoc-servers</artifactId>
  <version>0.0.1-SNAPSHOT</version>
  <packaging>jar</packaging>

  <dependencies>
    <!-- Dependência do Spring Boot Starter Web -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- SpringDoc OpenAPI Starter para Spring MVC (Gerencia Swagger UI) -->
    <dependency>
      <groupId>org.springdoc</groupId>
      <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
      <version>2.1.0</version>
    </dependency>

    <!-- (Opcional) Para perfil de produção, se usar HTTPS, etc. -->
    <!-- <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency> -->
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

### 2. `src/main/resources/application.yaml`

```yaml
# Propriedades comuns a todos os perfis
spring:
  application:
    name: api-springdoc-servers

# Definição padrão (se nenhum profile estiver ativo)
api:
  server:
    url: http://localhost:8080
    desc: "Servidor Local (Dev)"

# Configurações do Swagger UI: pode apontar para o docs do próprio ambiente
springdoc:
  api-docs:
    path: /v3/api-docs
  swagger-ui:
    urls:
      - name: Dev
        url: http://localhost:8080/v3/api-docs
      - name: QA
        url: https://qa.minhaapi.com/v3/api-docs
      - name: Prod
        url: https://api.minhaapi.com/v3/api-docs

```

```yaml
# application-qa.yaml  (ativo via -Dspring.profiles.active=qa)
api:
  server:
    url: https://qa.minhaapi.com
    desc: "Ambiente QA"

springdoc:
  swagger-ui:
    urls:
      - name: QA
        url: https://qa.minhaapi.com/v3/api-docs
      - name: Prod
        url: https://api.minhaapi.com/v3/api-docs

```

```yaml
# application-prod.yaml  (ativo via -Dspring.profiles.active=prod)
api:
  server:
    url: https://api.minhaapi.com
    desc: "Ambiente Produção"

springdoc:
  swagger-ui:
    urls:
      - name: Prod
        url: https://api.minhaapi.com/v3/api-docs

```

---

### 3. Configuração do OpenAPI via Classe de Configuração

```java
package com.exemplo.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

/**
 * Configurações gerais do OpenAPI (SpringDoc) para definir servidores dinamicamente.
 */
@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "API Exemplo com SpringDoc - Múltiplos Servidores",
        version = "1.0.0",
        description = "Documentação gerada automaticamente usando SpringDoc. " +
                      "Selecione o servidor desejado no Swagger UI."
    ),
    servers = {
        @Server(url = "${api.server.url}", description = "${api.server.desc}")
    }
)
public class OpenApiConfig {
    // A injeção das propriedades ${api.server.url} e ${api.server.desc}
    // é resolvida via application.yaml de acordo com o profile ativo.
}

```

- O Spring resolverá `${api.server.url}` e `${api.server.desc}` baseando-se no `application-*.yaml` correspondente ao profile ativo.
- Se nenhum profile for informado, ele usará o bloco padrão em `application.yaml` (Dev).

---

### 4. Exemplo de Controller Simples

```java
package com.exemplo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/saudacao")
public class SaudacaoController {

    @Operation(
        summary = "Retorna uma saudação simples",
        description = "Endpoint de exemplo que retorna um texto de boas-vindas."
    )
    @ApiResponse(responseCode = "200", description = "Sucesso ao obter saudação")
    @GetMapping
    public String getSaudacao() {
        return "Olá! Bem-vindo à API de exemplo.";
    }
}

```

- Observe que não é necessário nenhuma anotação extra para o SpringDoc — ele detecta automaticamente esse controller e expõe no JSON do OpenAPI.

---

### 5. Executando e Acessando o Swagger UI

1. Compile e execute a aplicação:
    
    ```bash
    mvn spring-boot:run
    
    ```
    
2. Acesse no navegador:
    
    ```
    http://localhost:8080/swagger-ui.html
    
    ```
    
3. No topo da página do Swagger UI, haverá um menu suspenso “Servers” (caso o JSON `/v3/api-docs` contenha múltiplos servidores) ou, se você definiu apenas um `@Server`, ele já aparecerá selecionado.
4. Se você desejar alternar para o servidor de homologação ou produção, basta ativar o profile correspondente ao executar a aplicação:
    
    ```bash
    mvn spring-boot:run -Dspring-boot.run.profiles=qa
    
    ```
    
    — Assim, o Swagger UI exibirá por padrão o servidor `https://qa.minhaapi.com`.
    

---

## Cenários de Restrição ou Não Aplicação

1. **APIs Internas ou Sistemas Monolíticos Pequenos**
    - Se nenhuma outra equipe consome diretamente o seu JSON do OpenAPI, talvez seja desnecessário configurar múltiplos servidores.
2. **Ambientes com URLs Dinâmicas (Service Discovery)**
    - Em arquiteturas baseadas em microsserviços com balanceadores ou service registry, as URLs podem mudar a todo momento. Neste caso, documente “`{nome-do-serviço}.minhaempresa.com`” e deixe claro na documentação que a descoberta se dá por DNS/Load Balancer.
3. **Projetos Legados sem Dependência de Spring Boot**
    - Se você não usa Spring Boot ou uma versão incompatível do SpringDoc, a abordagem muda (há anotações próprias do Swagger 2).

---

## Componentes-Chave Associados

| Componente | Descrição | Exemplo de Uso |
| --- | --- | --- |
| `@OpenAPIDefinition` | Anotação de nível global que define metadados do OpenAPI (info, servers, tags, components). | `@OpenAPIDefinition(info = @Info(...), servers = {...})` |
| `@Info` | Sub-anotação para metadados básicos: `title`, `version`, `description`, `termsOfService`, `contact`, etc. | `@Info(title="API", version="1.0", description="...")` |
| `@Server` | Define um servidor (URL base) na especificação OpenAPI. Pode conter `url`, `description` e `variables`. | `@Server(url="${api.server.url}", description="${api.server.desc}")` |
| `@ServerVariable` | Sub-anotação de `@Server`, para criar variáveis de servidor (por ex. `host`, `port`). | `@ServerVariable(name="port", defaultValue="8080")` |
| `GroupedOpenApi` | Classe que permite criar grupos de APIs (por ex. V1, V2) com configuração própria de paths/servers. | `GroupedOpenApi.builder().group("v1").pathsToMatch("/v1/**").build();` |
| `springdoc.api-docs.path` | Propriedade para alterar o endpoint onde o JSON YAML do OpenAPI é exposto (padrão: `/v3/api-docs`). | `springdoc.api-docs.path=/docs/v3/api-docs` |
| `springdoc.swagger-ui.urls` | Lista de *labels* e URLs para carregar diferentes definições OpenAPI no Swagger UI. | Ver seção “Configuração via application.yaml” acima. |
| `@Operation`, `@ApiResponse`, `@Parameter` | Anotações de endpoint para enriquecer o JSON gerado com descrições de operação, respostas, parâmetros. | `@Operation(summary="...", description="...")` |

---

## Melhores Práticas e Padrões de Uso

1. **Utilizar Spring Profiles para Ambientes**
    - Evite strings fixas no código. Defina URLs e descrições de servidor em `application-{profile}.yaml`.
2. **Documentar Variáveis de Servidor Quando Apropriado**
    - Por exemplo, se seu serviço pode responder em diferentes portas ou subdomínios, utilize `@ServerVariable`. Isso torna o Swagger UI interativo.
3. **Manter a Versão da API Atualizada**
    - Atualize `version` em `@Info` sempre que fizer *breaking changes*.
4. **Separar Documentações por Versão (GroupedOpenApi)**
    - Se lançar uma versão 2 da API, crie um `GroupedOpenApi` para `/v2/**` e defina servidores específicos, deixando o grupo `/v1/**` inalterado.
5. **Não Expor Endpoints Sensíveis no Swagger**
    - Se tiver endpoints de administração ou seguros, use atributos como `@SecurityRequirement` e condicione a exibição via roles/perfis, se necessário.
6. **Sincronizar Comitês de QA/Front-End**
    - Sempre que houver alteração de URL (ex.: mudança de DNS em produção), comunique o time para atualizar as propriedades de `swagger-ui.urls`.
7. **Testar a Documentação em Cada Ambiente**
    - Use o CI/CD para verificar que `/v3/api-docs` gera JSON válido em cada profile.

---

## Exemplo Prático Completo (Projeto Simplificado)

Abaixo, um projeto enxuto que demonstra todas as etapas vistas:

1. **Estrutura de diretórios**
    
    ```
    api-springdoc-servers/
    ├── pom.xml
    ├── src/
    │   ├── main/
    │   │   ├── java/com/exemplo/
    │   │   │   ├── Application.java
    │   │   │   ├── config/OpenApiConfig.java
    │   │   │   └── controller/SaudacaoController.java
    │   │   └── resources/
    │   │       ├── application.yaml
    │   │       ├── application-qa.yaml
    │   │       └── application-prod.yaml
    │   └── test/
    │       └── java/ (não mostrado)
    └── README.md
    
    ```
    
2. **`Application.java`**
    
    ```java
    package com.exemplo;
    
    import org.springframework.boot.SpringApplication;
    import org.springframework.boot.autoconfigure.SpringBootApplication;
    
    @SpringBootApplication
    public class Application {
        public static void main(String[] args) {
            SpringApplication.run(Application.class, args);
        }
    }
    
    ```
    
3. **`OpenApiConfig.java`**
    
    ```java
    package com.exemplo.config;
    
    import io.swagger.v3.oas.annotations.OpenAPIDefinition;
    import io.swagger.v3.oas.annotations.info.Info;
    import io.swagger.v3.oas.annotations.servers.Server;
    import org.springframework.context.annotation.Configuration;
    
    @Configuration
    @OpenAPIDefinition(
        info = @Info(
            title = "API Multi-Ambientes Exemplo",
            version = "1.0.0",
            description = "API demonstrativa com servidores configuráveis para Dev, QA e Prod"
        ),
        servers = {
            @Server(url = "${api.server.url}", description = "${api.server.desc}")
        }
    )
    public class OpenApiConfig {
        // Propriedades de servidor são resolvidas de acordo com o profile ativo:
        // - dev (padrão): http://localhost:8080
        // - qa: https://qa.minhaapi.com
        // - prod: https://api.minhaapi.com
    }
    
    ```
    
4. **`SaudacaoController.java`**
    
    ```java
    package com.exemplo.controller;
    
    import io.swagger.v3.oas.annotations.Operation;
    import io.swagger.v3.oas.annotations.responses.ApiResponse;
    import org.springframework.web.bind.annotation.GetMapping;
    import org.springframework.web.bind.annotation.RequestMapping;
    import org.springframework.web.bind.annotation.RestController;
    
    @RestController
    @RequestMapping("/api/saudacao")
    public class SaudacaoController {
    
        @Operation(
            summary = "Retorna mensagem de saudação",
            description = "Exemplo de endpoint simples para demonstrar documentação"
        )
        @ApiResponse(responseCode = "200", description = "Retorna texto de saudação")
        @GetMapping
        public String getSaudacao() {
            return "Olá, bem-vindo à API exemplo!";
        }
    }
    
    ```
    
5. **`application.yaml`** (profile **padrão**, Dev)
    
    ```yaml
    spring:
      application:
        name: api-springdoc-servers
    
    api:
      server:
        url: http://localhost:8080
        desc: "Servidor Local (Dev)"
    
    springdoc:
      api-docs:
        path: /v3/api-docs
      swagger-ui:
        urls:
          - name: Dev
            url: http://localhost:8080/v3/api-docs
          - name: QA
            url: https://qa.minhaapi.com/v3/api-docs
          - name: Prod
            url: https://api.minhaapi.com/v3/api-docs
    
    ```
    
6. **`application-qa.yaml`** (profile **qa**)
    
    ```yaml
    api:
      server:
        url: https://qa.minhaapi.com
        desc: "Ambiente QA"
    
    springdoc:
      swagger-ui:
        urls:
          - name: QA
            url: https://qa.minhaapi.com/v3/api-docs
          - name: Prod
            url: https://api.minhaapi.com/v3/api-docs
    
    ```
    
7. **`application-prod.yaml`** (profile **prod**)
    
    ```yaml
    api:
      server:
        url: https://api.minhaapi.com
        desc: "Ambiente Produção"
    
    springdoc:
      swagger-ui:
        urls:
          - name: Prod
            url: https://api.minhaapi.com/v3/api-docs
    
    ```
    

---

### Passo a Passo para Testar

1. **Modo Dev (profile padrão)**
    
    ```bash
    mvn spring-boot:run
    
    ```
    
    - Acesse `http://localhost:8080/swagger-ui.html`
    - No Swagger UI, verá o servidor “Servidor Local (Dev)” selecionado e, no dropdown, as opções “Dev / QA / Prod” (apesar de QA e Prod apontarem para URLs que ainda não estão ativadas, pois a aplicação não está rodando ali).
2. **Modo QA**
    
    ```bash
    mvn spring-boot:run -Dspring-boot.run.profiles=qa
    
    ```
    
    - Acesse `http://localhost:8080/swagger-ui.html` (notar que a porta 8080 ainda está disponível, mas o JSON gerado conterá o servidor “[https://qa.minhaapi.com”](https://qa.minhaapi.xn--com-9o0a/))
    - O dropdown do Swagger UI mostrará apenas “QA” e “Prod” (já que, no `application-qa.yaml`, removemos a URL Dev da lista).
3. **Modo Prod**
    
    ```bash
    mvn spring-boot:run -Dspring-boot.run.profiles=prod
    
    ```
    
    - Acesse `http://localhost:8080/swagger-ui.html`
    - O Swagger UI apresentará somente a opção “Prod” com URL `https://api.minhaapi.com/v3/api-docs`.

---

## Sugestões para Aprofundamento

- **Documentar Variáveis Complexas de Servidor:**
    
    Se sua arquitetura usar subdomínios ou portas variáveis, aprofunde em `@ServerVariable`, permitindo que consumidores escolham, por exemplo, ambiente (`dev`, `qa`, `prod`) ou versão de API (`v1`, `v2`).
    
- **Agrupar APIs por Versão ou Módulos:**
    
    Com `GroupedOpenApi`, crie diversos endpoints de documentação (por ex. `/v1/api-docs`, `/v2/api-docs`), cada um com servidores distintos.
    
- **Customização do Swagger UI:**
    
    Explore propriedades como `springdoc.swagger-ui.theme` ou inclua arquivos `swagger-ui-config.js` próprios para personalizar a interface (cores, logo, layout).
    
- **Segurança/Autenticação na Documentação:**
    
    Utilize `@SecurityScheme` e `@SecurityRequirement` para configurar autenticação baseada em JWT ou OAuth2, garantindo que o Swagger UI exija token para chamar endpoints protegidos.
    
- **Validação Automática de Esquema:**
    
    Inclua testes unitários/integration tests (por exemplo, usando **springdoc-openapi-webflux-core** ou dependências de validação JSON) para assegurar que a especificação gerada corresponde exatamente aos contratos esperados.
    

---

> Resumo Final:
> 
> 1. O SpringDoc gera automaticamente a documentação OpenAPI 3 para sua aplicação Spring Boot.
> 2. Definir servidores (ambientes) melhora a usabilidade do Swagger UI, permitindo selecionar URLs Dev/QA/Prod.
> 3. A anotação `@OpenAPIDefinition(servers = {...})` é a forma mais direta—e pode usar variáveis de ambiente para troca dinâmica por **Spring Profiles**.
> 4. Alternativamente, edite `springdoc.swagger-ui.urls` em `application.yaml` para listar várias fontes de documentação.
> 5. Siga boas práticas: não hardcodear URLs em código, manter documentação sincronizada e separar configurações por profiles ou grupos de API.

Espero que este material atenda às suas expectativas de descrição completa e exemplos práticos para configuração de servidores/ambientes no Swagger via SpringDoc em Spring Boot. Caso queira que eu aprofunde algum ponto específico ou inclua outros cenários avançados, fique à vontade para pedir!